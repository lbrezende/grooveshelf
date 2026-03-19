"use client";

import { useState, useMemo, useCallback, type DragEvent } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Disc3,
  X,
  CalendarRange,
  GripVertical,
  AlertTriangle,
} from "lucide-react";
import { PaywallGate } from "@/components/paywall/paywall-gate";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  targetPrice?: number;
  status: "WANTING" | "BOUGHT";
}

interface MonthlyList {
  id: string;
  month: string; // "YYYY-MM"
  budget?: number;
  itemIds: string[];
  status?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const DEFAULT_BUDGET = 150;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function monthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function getPrice(item: WishlistItem) {
  return item.targetPrice ?? 0;
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function MonthlyPlanningPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear(),
  );

  // Drag state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverMonth, setDragOverMonth] = useState<string | null>(null);

  // Inline-editing budgets keyed by "YYYY-MM"
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [budgetDraft, setBudgetDraft] = useState("");

  const userPlan = (session?.user as { plan?: string })?.plan ?? "FREE";
  const isFree = userPlan === "FREE";

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  const { data: wishlist = [], isLoading: loadingWishlist } = useQuery<
    WishlistItem[]
  >({
    queryKey: ["wishlist"],
    queryFn: () => fetch("/api/wishlist").then((r) => r.json()),
  });

  const { data: allMonthlyLists = [], isLoading: loadingLists } = useQuery<
    MonthlyList[]
  >({
    queryKey: ["monthly-list"],
    queryFn: () => fetch("/api/monthly-list").then((r) => r.json()),
  });

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  // Monthly lists for selected year, indexed by "YYYY-MM"
  const listsForYear = useMemo(() => {
    const map: Record<string, MonthlyList> = {};
    for (const list of allMonthlyLists) {
      if (list.month.startsWith(`${selectedYear}-`)) {
        map[list.month] = list;
      }
    }
    return map;
  }, [allMonthlyLists, selectedYear]);

  // All item IDs already allocated to any month across all years
  const allocatedItemIds = useMemo(() => {
    const set = new Set<string>();
    for (const list of allMonthlyLists) {
      for (const id of list.itemIds ?? []) {
        set.add(id);
      }
    }
    return set;
  }, [allMonthlyLists]);

  // Sidebar items: WANTING and not yet allocated
  const wantingItems = useMemo(
    () => wishlist.filter((w) => w.status === "WANTING"),
    [wishlist],
  );

  // Wishlist map for quick lookup
  const wishlistMap = useMemo(() => {
    const m: Record<string, WishlistItem> = {};
    for (const item of wishlist) m[item.id] = item;
    return m;
  }, [wishlist]);

  // ---------------------------------------------------------------------------
  // Mutation
  // ---------------------------------------------------------------------------

  const upsertList = useMutation({
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
        if (!r.ok) throw new Error("Erro ao salvar lista");
        return r.json();
      }),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["monthly-list"] });
      const previous =
        queryClient.getQueryData<MonthlyList[]>(["monthly-list"]) ?? [];

      // Optimistic update
      const idx = previous.findIndex((l) => l.month === newData.month);
      let next: MonthlyList[];
      if (idx >= 0) {
        next = [...previous];
        next[idx] = { ...next[idx], ...newData };
      } else {
        next = [
          ...previous,
          {
            id: `temp-${newData.month}`,
            month: newData.month,
            budget: newData.budget,
            itemIds: newData.itemIds,
            createdAt: new Date().toISOString(),
          },
        ];
      }
      queryClient.setQueryData(["monthly-list"], next);
      return { previous };
    },
    onError: (_err, _data, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["monthly-list"], ctx.previous);
      }
      toast.error("Erro ao salvar lista mensal.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-list"] });
    },
  });

  // ---------------------------------------------------------------------------
  // Helpers for mutations
  // ---------------------------------------------------------------------------

  const getListData = useCallback(
    (month: string) => {
      const existing = listsForYear[month];
      return {
        itemIds: existing?.itemIds ?? [],
        budget: existing?.budget ?? DEFAULT_BUDGET,
      };
    },
    [listsForYear],
  );

  function addItemToMonth(wishlistItemId: string, month: string) {
    const { itemIds, budget } = getListData(month);
    if (itemIds.includes(wishlistItemId)) {
      toast.error("Este album ja esta neste mes.");
      return;
    }
    upsertList.mutate({
      month,
      budget,
      itemIds: [...itemIds, wishlistItemId],
    });
    toast.success("Album alocado!");
  }

  function removeItemFromMonth(wishlistItemId: string, month: string) {
    const { itemIds, budget } = getListData(month);
    upsertList.mutate({
      month,
      budget,
      itemIds: itemIds.filter((id) => id !== wishlistItemId),
    });
    toast.success("Album removido do mes.");
  }

  function saveBudget(month: string, value: string) {
    const parsed = parseFloat(value);
    const { itemIds } = getListData(month);
    upsertList.mutate({
      month,
      budget: isNaN(parsed) || parsed <= 0 ? DEFAULT_BUDGET : parsed,
      itemIds,
    });
    setEditingBudget(null);
  }

  // ---------------------------------------------------------------------------
  // Drag handlers
  // ---------------------------------------------------------------------------

  function handleDragStart(e: DragEvent, item: WishlistItem) {
    e.dataTransfer.setData("text/plain", item.id);
    e.dataTransfer.effectAllowed = "move";
    setDraggedItemId(item.id);
  }

  function handleDragOver(e: DragEvent, month: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverMonth(month);
  }

  function handleDragLeave() {
    setDragOverMonth(null);
  }

  function handleDrop(e: DragEvent, month: string) {
    e.preventDefault();
    setDragOverMonth(null);
    setDraggedItemId(null);
    const wishlistItemId = e.dataTransfer.getData("text/plain");
    if (wishlistItemId) {
      addItemToMonth(wishlistItemId, month);
    }
  }

  function handleDragEnd() {
    setDraggedItemId(null);
    setDragOverMonth(null);
  }

  // ---------------------------------------------------------------------------
  // Budget helpers per month
  // ---------------------------------------------------------------------------

  function monthSpent(month: string) {
    const list = listsForYear[month];
    if (!list?.itemIds) return 0;
    return list.itemIds.reduce((sum, id) => {
      const item = wishlistMap[id];
      return sum + (item ? getPrice(item) : 0);
    }, 0);
  }

  function monthBudget(month: string) {
    return listsForYear[month]?.budget ?? DEFAULT_BUDGET;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const content = (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Planejamento <span className="text-primary">Mensal</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Arraste albuns da wishlist para os meses e controle seu orcamento.
          </p>
        </div>

        {/* Year selector */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setSelectedYear((y) => y - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[4rem] text-center text-lg font-bold text-foreground">
            {selectedYear}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setSelectedYear((y) => y + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main layout: sidebar + calendar */}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* ====== SIDEBAR ====== */}
        <div className="w-full shrink-0 lg:w-[280px]">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Wishlist
          </h2>

          {loadingWishlist ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : wantingItems.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              <Disc3 className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
              Nenhum item na wishlist.
            </div>
          ) : (
            <div className="flex flex-row gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0">
              {wantingItems.map((item) => {
                const isAllocated = allocatedItemIds.has(item.id);
                const isBeingDragged = draggedItemId === item.id;
                return (
                  <Card
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    className={`min-w-[200px] cursor-grab border-border bg-card transition-opacity active:cursor-grabbing lg:min-w-0 ${
                      isAllocated ? "opacity-40" : ""
                    } ${isBeingDragged ? "opacity-50 ring-2 ring-primary" : ""}`}
                  >
                    <CardContent className="flex items-center gap-3 p-3">
                      <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                      {item.album?.coverUrl ? (
                        <img
                          src={item.album.coverUrl}
                          alt={item.album.title}
                          className="h-10 w-10 shrink-0 rounded-md object-cover"
                          draggable={false}
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/20">
                          <Disc3 className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {item.album?.title ?? "Album"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.album?.artist?.name ?? "Artista"}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-primary">
                          R$ {getPrice(item).toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* ====== CALENDAR GRID ====== */}
        <div className="flex-1">
          {loadingLists ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                const mk = monthKey(selectedYear, month);
                const spent = monthSpent(mk);
                const budget = monthBudget(mk);
                const remaining = budget - spent;
                const overBudget = remaining < 0;
                const list = listsForYear[mk];
                const isDragOver = dragOverMonth === mk;

                return (
                  <div
                    key={mk}
                    onDragOver={(e) => handleDragOver(e, mk)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, mk)}
                    className={`flex min-h-[200px] flex-col rounded-lg border bg-card p-3 transition-colors ${
                      overBudget
                        ? "border-destructive"
                        : isDragOver
                          ? "border-primary bg-primary/10"
                          : "border-border"
                    }`}
                  >
                    {/* Month header */}
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">
                        {MONTH_LABELS[i]}
                      </span>
                      {overBudget && (
                        <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                      )}
                    </div>

                    {/* Budget bar */}
                    <div className="mb-2">
                      {editingBudget === mk ? (
                        <input
                          type="number"
                          autoFocus
                          className="w-full rounded border border-input bg-background px-1.5 py-0.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                          defaultValue={budget}
                          onBlur={(e) => saveBudget(mk, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              saveBudget(mk, (e.target as HTMLInputElement).value);
                            }
                            if (e.key === "Escape") {
                              setEditingBudget(null);
                            }
                          }}
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditingBudget(mk)}
                          className="group w-full text-left"
                        >
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              R${spent.toFixed(0)}{" "}
                              <span className="text-muted-foreground/60">
                                / {budget.toFixed(0)}
                              </span>
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full transition-all ${
                                overBudget ? "bg-destructive" : "bg-primary"
                              }`}
                              style={{
                                width: `${Math.min((spent / budget) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </button>
                      )}

                      {overBudget && (
                        <p className="mt-1 text-[10px] font-medium text-destructive">
                          Acima: R${Math.abs(remaining).toFixed(2)}
                        </p>
                      )}
                      {!overBudget && spent > 0 && (
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Sobra: R${remaining.toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Allocated albums */}
                    <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
                      {(list?.itemIds ?? []).map((itemId) => {
                        const wi = wishlistMap[itemId];
                        if (!wi) return null;
                        return (
                          <div
                            key={itemId}
                            className="group/item flex items-center gap-1.5 rounded-md bg-background/60 p-1.5"
                          >
                            {wi.album?.coverUrl ? (
                              <img
                                src={wi.album.coverUrl}
                                alt={wi.album.title}
                                className="h-6 w-6 shrink-0 rounded object-cover"
                              />
                            ) : (
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/20">
                                <Disc3 className="h-3 w-3 text-primary" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[11px] font-medium text-foreground">
                                {wi.album?.title ?? "Album"}
                              </p>
                              <p className="truncate text-[10px] text-muted-foreground">
                                R${getPrice(wi).toFixed(2)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItemFromMonth(itemId, mk)}
                              className="shrink-0 rounded p-0.5 opacity-0 transition-opacity hover:bg-destructive/20 group-hover/item:opacity-100"
                            >
                              <X className="h-3 w-3 text-destructive" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Empty state */}
                      {(!list?.itemIds || list.itemIds.length === 0) && (
                        <div className="flex flex-1 items-center justify-center">
                          <p className="text-center text-[10px] text-muted-foreground/60">
                            Arraste albuns aqui
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isFree) {
    return <PaywallGate hasAccess={false}>{content}</PaywallGate>;
  }

  return content;
}
