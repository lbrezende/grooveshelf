"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Disc3,
  Heart,
  Headphones,
  Plus,
  ListMusic,
  Star,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  const { data: artists, isLoading: loadingArtists } = useQuery({
    queryKey: ["artists"],
    queryFn: () => fetch("/api/artists").then((r) => r.json()),
  });

  const { data: albums, isLoading: loadingAlbums } = useQuery({
    queryKey: ["albums"],
    queryFn: () => fetch("/api/albums").then((r) => r.json()),
  });

  const { data: wishlist, isLoading: loadingWishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => fetch("/api/wishlist").then((r) => r.json()),
  });

  const { data: sessions, isLoading: loadingSessions } = useQuery({
    queryKey: ["listening"],
    queryFn: () => fetch("/api/listening").then((r) => r.json()),
  });

  const userName = session?.user?.name?.split(" ")[0] ?? "Colecionador";

  const stats = [
    {
      label: "Artistas",
      value: artists?.length ?? 0,
      icon: Music,
      loading: loadingArtists,
    },
    {
      label: "Albuns",
      value: albums?.length ?? 0,
      icon: Disc3,
      loading: loadingAlbums,
    },
    {
      label: "Wishlist",
      value: wishlist?.length ?? 0,
      icon: Heart,
      loading: loadingWishlist,
    },
    {
      label: "Sessoes",
      value: sessions?.length ?? 0,
      icon: Headphones,
      loading: loadingSessions,
    },
  ];

  const recentSessions = (sessions ?? []).slice(0, 5);

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Ola, <span className="text-primary">{userName}</span>!
        </h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo de volta ao GrooveShelf. Aqui esta o resumo da sua colecao.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-muted-foreground text-sm">
                {stat.label}
              </CardDescription>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Listening Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Sessoes recentes</CardTitle>
            <CardDescription>
              Suas ultimas sessoes de escuta
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSessions ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentSessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma sessao registrada ainda. Comece ouvindo um album!
              </p>
            ) : (
              <div className="space-y-3">
                {recentSessions.map(
                  (s: {
                    id: string;
                    album?: { title: string; coverUrl?: string; artist?: { name: string } };
                    rating: number;
                    listenedAt: string;
                    notes?: string;
                  }) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-4 rounded-lg bg-background/50 p-3 border border-border"
                    >
                      {s.album?.coverUrl ? (
                        <img
                          src={s.album.coverUrl}
                          alt={s.album.title}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                          <Disc3 className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {s.album?.title ?? "Album desconhecido"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {s.album?.artist?.name ?? "Artista"} &middot;{" "}
                          {new Date(s.listenedAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < s.rating
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Acoes rapidas</CardTitle>
            <CardDescription>Atalhos para acoes frequentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/app/library">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Plus className="h-4 w-4 text-primary" />
                Adicionar Artista
              </Button>
            </Link>
            <Link href="/app/wishlist">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Heart className="h-4 w-4 text-primary" />
                Adicionar a Wishlist
              </Button>
            </Link>
            <Link href="/app/listening">
              <Button className="w-full justify-start gap-2" variant="outline">
                <ListMusic className="h-4 w-4 text-primary" />
                Registrar Sessao
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
