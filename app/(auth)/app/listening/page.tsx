"use client";

import { useState, useMemo } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Disc3, Star, Headphones, BarChart3 } from "lucide-react";
import { safeFetchArray } from "@/lib/safe-fetch";

interface Album {
  id: string;
  title: string;
  coverUrl?: string;
  artist?: { name: string };
}

interface ListeningSession {
  id: string;
  albumId: string;
  album?: Album;
  rating: number;
  notes?: string;
  listenedAt: string;
}

function StarRating({
  value,
  onChange,
  readonly = false,
  size = "default",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "default" | "sm";
}) {
  const sizeClass = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}`}
        >
          <Star
            className={`${sizeClass} ${
              star <= value
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ListeningPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");

  // Queries
  const { data: sessions = [], isLoading: loadingSessions } = useQuery<
    ListeningSession[]
  >({
    queryKey: ["listening"],
    queryFn: () => safeFetchArray<ListeningSession>("/api/listening"),
  });

  const { data: albums = [] } = useQuery<Album[]>({
    queryKey: ["albums"],
    queryFn: () => safeFetchArray<Album>("/api/albums"),
  });

  // Stats
  const stats = useMemo(() => {
    if (sessions.length === 0)
      return { total: 0, avgRating: 0, mostListened: null };

    const avgRating =
      sessions.reduce((sum, s) => sum + s.rating, 0) / sessions.length;

    const albumCounts: Record<string, { count: number; album?: Album }> = {};
    for (const s of sessions) {
      const key = s.albumId;
      if (!albumCounts[key]) albumCounts[key] = { count: 0, album: s.album };
      albumCounts[key].count++;
    }

    const mostListened = Object.values(albumCounts).sort(
      (a, b) => b.count - a.count
    )[0];

    return {
      total: sessions.length,
      avgRating: Math.round(avgRating * 10) / 10,
      mostListened: mostListened?.album ?? null,
    };
  }, [sessions]);

  // Mutation
  const logSession = useMutation({
    mutationFn: (data: {
      albumId: string;
      rating: number;
      notes?: string;
    }) =>
      fetch("/api/listening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listening"] });
      toast.success("Sessao registrada!");
      resetForm();
      setDialogOpen(false);
    },
    onError: () => {
      toast.error("Erro ao registrar sessao.");
    },
  });

  function resetForm() {
    setSelectedAlbumId("");
    setRating(0);
    setNotes("");
  }

  function handleLog() {
    if (!selectedAlbumId) {
      toast.error("Selecione um album.");
      return;
    }
    if (rating === 0) {
      toast.error("De uma nota para a sessao.");
      return;
    }
    logSession.mutate({
      albumId: selectedAlbumId,
      rating,
      notes: notes || undefined,
    });
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Diario de <span className="text-primary">Escuta</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Registre e acompanhe suas sessoes de escuta.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground flex items-center gap-1.5">
              <Headphones className="h-4 w-4" />
              Total de sessoes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSessions ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground flex items-center gap-1.5">
              <Star className="h-4 w-4" />
              Media de avaliacao
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSessions ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-foreground">
                  {stats.avgRating}
                </p>
                <Star className="h-5 w-5 fill-primary text-primary" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" />
              Mais ouvido
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSessions ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-sm font-bold text-foreground truncate">
                {stats.mostListened?.title ?? "Nenhum ainda"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          Sessoes de escuta
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Registrar Sessao
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Sessao de Escuta</DialogTitle>
              <DialogDescription>
                Registre o que voce ouviu e de uma nota.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="listen-album">Album *</Label>
                <Select
                  value={selectedAlbumId}
                  onValueChange={(v) => setSelectedAlbumId(v ?? "")}
                >
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
                <Label>Avaliacao *</Label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="listen-notes">Notas</Label>
                <Textarea
                  id="listen-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Como foi a experiencia? Alguma faixa favorita?"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleLog}
                disabled={logSession.isPending}
              >
                {logSession.isPending ? "Salvando..." : "Registrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions list */}
      {loadingSessions ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Headphones className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>Nenhuma sessao registrada. Ouça um album e registre!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <Card key={s.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {s.album?.coverUrl ? (
                    <img
                      src={s.album.coverUrl}
                      alt={s.album.title}
                      className="h-16 w-16 rounded-md object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center shrink-0">
                      <Disc3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {s.album?.title ?? "Album desconhecido"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {s.album?.artist?.name ?? "Artista"} &middot;{" "}
                      {new Date(s.listenedAt).toLocaleDateString("pt-BR")}
                    </p>
                    {s.notes && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {s.notes}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    <StarRating value={s.rating} readonly size="sm" />
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
