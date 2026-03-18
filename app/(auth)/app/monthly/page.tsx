"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Calendar,
  Disc3,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import { PaywallGate } from "@/components/paywall/paywall-gate";

interface WishlistItem {
  id: string;
  albumId: string;
  album?: {
    id: string;
    title: string;
    coverUrl?: string;
    artist?: { name: string };
  };
  targetPrice?: number;
  status: "WANTING" | "BOUGHT";
}

interface MonthlyListItem {
  id: string;
  wishlistItemId: string;
  wishlistItem?: WishlistItem;
  currentPrice?: number;
}

interface MonthlyList {
  id: string;
  month: string;
  budget?: number;
  items: MonthlyListItem[];
  itemIds?: string[];
  status?: string;
  createdAt: string;
}

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function getMonthLabel(monthStr: string) {
  const [year, month] = monthStr.split("-");
  return `${MONTHS[parseInt(month) - 1]} ${year}`;
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function MonthlyListPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [budget, setBudget] = useState("");
  const [selectedWishlistIds, setSelectedWishlistIds] = useState<string[]>([]);

  const userPlan = (session?.user as { plan?: string })?.plan ?? "FREE";
  const isFree = userPlan === "FREE";

  // Queries
  const { data: monthlyLists = [], isLoading: loadingLists } = useQuery<
    MonthlyList[]
  >({
    queryKey: ["monthly-list"],
    queryFn: () => fetch("/api/monthly-list").then((r) => r.json()),
  });

  const { data: wishlist = [] } = useQuery<WishlistItem[]>({
    queryKey: ["wishlist"],
    queryFn: () => fetch("/api/wishlist").then((r) => r.json()),
  });

  // Current month list
  const currentMonth = getCurrentMonth();
  const currentList = monthlyLists.find((l) => l.month === currentMonth);

  // Wanting items from wishlist
  const wantingItems = useMemo(
    () => wishlist.filter((w) => w.status === "WANTING"),
    [wishlist]
  );

  // Total cost of current list
  const totalCost = useMemo(() => {
    if (!currentList?.items) return 0;
    return currentList.items.reduce(
      (sum, item) =>
        sum + (item.currentPrice ?? item.wishlistItem?.targetPrice ?? 0),
      0
    );
  }, [currentList]);

  // Mutation
  const createList = useMutation({
    mutationFn: (data: {
      month: string;
      budget?: number;
      itemIds: string[];
    }) =>
      fetch("/api/monthly-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) throw new Error("Erro ao criar lista");
        return r.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-list"] });
      toast.success("Lista mensal criada!");
      resetForm();
      setDialogOpen(false);
    },
    onError: () => {
      toast.error("Erro ao criar lista mensal.");
    },
  });

  function resetForm() {
    setSelectedMonth(getCurrentMonth());
    setBudget("");
    setSelectedWishlistIds([]);
  }

  function handleCreate() {
    if (selectedWishlistIds.length === 0) {
      toast.error("Selecione pelo menos um item da wishlist.");
      return;
    }
    createList.mutate({
      month: selectedMonth,
      budget: budget ? parseFloat(budget) : undefined,
      itemIds: selectedWishlistIds,
    });
  }

  function toggleWishlistItem(id: string) {
    setSelectedWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  const content = (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Lista <span className="text-primary">Mensal</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Planeje suas compras mensais de vinil com orcamento.
        </p>
      </div>

      {/* Current Month Summary */}
      {currentList && currentList.items && (
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {getMonthLabel(currentList.month)}
                </CardTitle>
                <CardDescription className="mt-1">
                  {currentList.items.length} item
                  {currentList.items.length !== 1 ? "s" : ""} na lista
                </CardDescription>
              </div>
              {currentList.budget && (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Orcamento</p>
                  <p className="text-lg font-bold text-foreground">
                    R$ {currentList.budget.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      totalCost > currentList.budget
                        ? "text-destructive"
                        : "text-primary"
                    }`}
                  >
                    {totalCost > currentList.budget ? "Acima" : "Dentro"} do
                    orcamento (R$ {totalCost.toFixed(2)})
                  </p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentList.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-lg bg-background/50 p-3 border border-border"
                >
                  {item.wishlistItem?.album?.coverUrl ? (
                    <img
                      src={item.wishlistItem.album.coverUrl}
                      alt={item.wishlistItem.album.title}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                      <Disc3 className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.wishlistItem?.album?.title ?? "Album"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.wishlistItem?.album?.artist?.name ?? "Artista"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      R${" "}
                      {(
                        item.currentPrice ??
                        item.wishlistItem?.targetPrice ??
                        0
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          Todas as listas
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Criar Lista
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Lista Mensal</DialogTitle>
              <DialogDescription>
                Selecione o mes, defina um orcamento e escolha os itens da
                wishlist.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="month">Mes</Label>
                <Input
                  id="month"
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Orcamento (R$)</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ex: 500.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Itens da Wishlist</Label>
                {wantingItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum item na wishlist. Adicione primeiro.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {wantingItems.map((item) => (
                      <label
                        key={item.id}
                        className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                          selectedWishlistIds.includes(item.id)
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedWishlistIds.includes(item.id)}
                          onChange={() => toggleWishlistItem(item.id)}
                          className="sr-only"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.album?.title ?? "Album"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.album?.artist?.name ?? "Artista"}
                            {item.targetPrice &&
                              ` — R$ ${item.targetPrice.toFixed(2)}`}
                          </p>
                        </div>
                        <div
                          className={`h-4 w-4 rounded border ${
                            selectedWishlistIds.includes(item.id)
                              ? "bg-primary border-primary"
                              : "border-muted-foreground"
                          }`}
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreate}
                disabled={createList.isPending}
              >
                {createList.isPending ? "Criando..." : "Criar Lista"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* All lists */}
      {loadingLists ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : monthlyLists.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>Nenhuma lista mensal criada. Comece planejando suas compras!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {monthlyLists.map((list) => (
            <Card key={list.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <p className="font-semibold text-foreground">
                      {getMonthLabel(list.month)}
                    </p>
                    <Badge variant="secondary">
                      {(list.items?.length ?? list.itemIds?.length ?? 0)} item
                      {(list.items?.length ?? list.itemIds?.length ?? 0) !== 1 ? "s" : ""}
                    </Badge>
                    {list.status && (
                      <Badge
                        variant={
                          list.status === "FINALIZED" ? "default" : "outline"
                        }
                      >
                        {list.status === "FINALIZED" ? "Finalizada" : "Rascunho"}
                      </Badge>
                    )}
                  </div>
                  {list.budget && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      R$ {list.budget.toFixed(2)}
                    </div>
                  )}
                </div>
                {list.items && list.items.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {list.items.map((item) => (
                      <Badge key={item.id} variant="outline">
                        {item.wishlistItem?.album?.title ?? "Album"}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // Wrap in PaywallGate for FREE users
  if (isFree) {
    return (
      <PaywallGate hasAccess={false}>
        {content}
      </PaywallGate>
    );
  }

  return content;
}
