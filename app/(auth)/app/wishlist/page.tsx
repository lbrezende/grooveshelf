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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Heart,
  Disc3,
  ExternalLink,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";
import { safeFetchArray } from "@/lib/safe-fetch";

interface Album {
  id: string;
  title: string;
  coverUrl?: string;
  artist?: { name: string };
}

interface WishlistItem {
  id: string;
  albumId: string;
  album?: Album;
  priorityScore: number;
  targetPrice?: number;
  amazonUrl?: string;
  status: "WANTING" | "BOUGHT";
  createdAt: string;
}

export default function WishlistPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [amazonUrl, setAmazonUrl] = useState("");

  // Queries
  const { data: wishlist = [], isLoading: loadingWishlist } = useQuery<
    WishlistItem[]
  >({
    queryKey: ["wishlist"],
    queryFn: () => safeFetchArray<WishlistItem>("/api/wishlist"),
  });

  const { data: albums = [] } = useQuery<Album[]>({
    queryKey: ["albums"],
    queryFn: () => safeFetchArray<Album>("/api/albums"),
  });

  // Sorted by priority score descending
  const sortedWishlist = useMemo(
    () => [...wishlist].sort((a, b) => b.priorityScore - a.priorityScore),
    [wishlist]
  );

  // Mutations
  const addToWishlist = useMutation({
    mutationFn: (data: {
      albumId: string;
      targetPrice?: number;
      amazonUrl?: string;
    }) =>
      fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Adicionado a wishlist!");
      resetForm();
      setDialogOpen(false);
    },
    onError: () => {
      toast.error("Erro ao adicionar a wishlist.");
    },
  });

  const markAsBought = useMutation({
    mutationFn: (id: string) =>
      fetch("/api/wishlist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "BOUGHT" }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Marcado como comprado!");
    },
    onError: () => {
      toast.error("Erro ao atualizar status.");
    },
  });

  function resetForm() {
    setSelectedAlbumId("");
    setTargetPrice("");
    setAmazonUrl("");
  }

  function handleAdd() {
    if (!selectedAlbumId) {
      toast.error("Selecione um album.");
      return;
    }
    addToWishlist.mutate({
      albumId: selectedAlbumId,
      targetPrice: targetPrice ? parseFloat(targetPrice) : undefined,
      amazonUrl: amazonUrl || undefined,
    });
  }

  // Check if user is FREE plan
  const userPlan = (session?.user as { plan?: string })?.plan ?? "FREE";
  const isFree = userPlan === "FREE";
  const wishlistLimit = 10;
  const isAtLimit = isFree && wishlist.length >= wishlistLimit;

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          <span className="text-primary">Wishlist</span> de Vinil
        </h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe os vinis que voce quer comprar, ordenados por prioridade.
        </p>
      </div>

      {/* FREE plan warning */}
      {isFree && (
        <Card className="bg-card border-primary/30 mb-6">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-foreground">
                Plano Free: <strong>{wishlist.length}/{wishlistLimit}</strong> itens
                na wishlist.{" "}
                {isAtLimit
                  ? "Voce atingiu o limite. Faca upgrade para adicionar mais."
                  : "Faca upgrade para itens ilimitados."}
              </p>
            </div>
            <a href="/settings/billing">
              <Button size="sm" variant="default">Upgrade</Button>
            </a>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          {wishlist.length} item{wishlist.length !== 1 ? "s" : ""}
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button
                size="sm"
                className="gap-1.5"
                disabled={isAtLimit}
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar a Wishlist</DialogTitle>
              <DialogDescription>
                Selecione um album da sua biblioteca e defina o preco alvo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wish-album">Album *</Label>
                <Select value={selectedAlbumId} onValueChange={(v) => setSelectedAlbumId(v ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um album" />
                  </SelectTrigger>
                  <SelectContent>
                    {albums.map((album) => (
                      <SelectItem key={album.id} value={album.id}>
                        {album.title} — {album.artist?.name ?? "Artista"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wish-price">Preco alvo (R$)</Label>
                <Input
                  id="wish-price"
                  type="number"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Ex: 149.90"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wish-amazon">Link (Amazon, loja, etc.)</Label>
                <Input
                  id="wish-amazon"
                  value={amazonUrl}
                  onChange={(e) => setAmazonUrl(e.target.value)}
                  placeholder="https://www.amazon.com.br/..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAdd}
                disabled={addToWishlist.isPending}
              >
                {addToWishlist.isPending ? "Salvando..." : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Wishlist Items */}
      {loadingWishlist ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : sortedWishlist.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>Sua wishlist esta vazia. Adicione albuns que voce deseja!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedWishlist.map((item) => (
            <Card key={item.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {item.album?.coverUrl ? (
                    <img
                      src={item.album.coverUrl}
                      alt={item.album.title}
                      className="h-16 w-16 rounded-md object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center shrink-0">
                      <Disc3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground truncate">
                        {item.album?.title ?? "Album"}
                      </p>
                      <Badge
                        variant={
                          item.status === "BOUGHT" ? "default" : "secondary"
                        }
                      >
                        {item.status === "BOUGHT" ? "Comprado" : "Querendo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.album?.artist?.name ?? "Artista"}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>
                        Prioridade:{" "}
                        <span className="text-primary font-medium">
                          {item.priorityScore}
                        </span>
                      </span>
                      {item.targetPrice && (
                        <span>Alvo: R$ {item.targetPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.amazonUrl && (
                      <a
                        href={item.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-input bg-background hover:bg-accent"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {item.status === "WANTING" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => markAsBought.mutate(item.id)}
                        disabled={markAsBought.isPending}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Comprei
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
