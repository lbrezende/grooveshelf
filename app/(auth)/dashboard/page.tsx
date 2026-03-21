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
import { safeFetchArray } from "@/lib/safe-fetch";

/* Spotify CDN covers for the skeleton/demo state */
const DEMO_COVERS = [
  "https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b", // Rumours
  "https://i.scdn.co/image/ab67616d0000b2734637341b9f507521afa9a778", // Dark Side
  "https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25", // Abbey Road
  "https://i.scdn.co/image/ab67616d0000b27328b8b9b46c977b1ce6714d93", // Kind of Blue
  "https://i.scdn.co/image/ab67616d0000b273f6b55ca93bd33211227b502b", // OK Computer
  "https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e", // AM
  "https://i.scdn.co/image/ab67616d0000b273b7e976d2b35c767362206b63", // Random Access Memories
  "https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe", // Thriller
];

const DEMO_ALBUMS = [
  { title: "Rumours", artist: "Fleetwood Mac", year: "1977" },
  { title: "The Dark Side of the Moon", artist: "Pink Floyd", year: "1973" },
  { title: "Abbey Road", artist: "The Beatles", year: "1969" },
  { title: "Kind of Blue", artist: "Miles Davis", year: "1959" },
  { title: "OK Computer", artist: "Radiohead", year: "1997" },
  { title: "AM", artist: "Arctic Monkeys", year: "2013" },
  { title: "Random Access Memories", artist: "Daft Punk", year: "2013" },
  { title: "Thriller", artist: "Michael Jackson", year: "1982" },
];

export default function DashboardPage() {
  const { data: session } = useSession();

  const { data: artists, isLoading: loadingArtists } = useQuery({
    queryKey: ["artists"],
    queryFn: () => safeFetchArray<Record<string, unknown>>("/api/artists"),
  });

  const { data: albums, isLoading: loadingAlbums } = useQuery({
    queryKey: ["albums"],
    queryFn: () =>
      safeFetchArray<{
        id: string;
        title: string;
        coverUrl?: string;
        artist?: { name: string };
      }>("/api/albums"),
  });

  const { data: wishlist, isLoading: loadingWishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => safeFetchArray<Record<string, unknown>>("/api/wishlist"),
  });

  const { data: sessions, isLoading: loadingSessions } = useQuery({
    queryKey: ["listening"],
    queryFn: () =>
      safeFetchArray<{
        id: string;
        album?: { title: string; coverUrl?: string; artist?: { name: string } };
        rating: number;
        listenedAt: string;
        notes?: string;
      }>("/api/listening"),
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
  const hasAlbums = albums && albums.length > 0;
  const hasSessions = sessions && sessions.length > 0;

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
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

      {/* Collection Grid — shows real data or demo skeleton cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Sua Colecao</h2>
            <p className="text-sm text-muted-foreground">
              {hasAlbums
                ? `${albums.length} albuns na sua estante`
                : "Adicione vinis para preencher sua estante"}
            </p>
          </div>
          <Link href="/app/library">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Adicionar
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loadingAlbums
            ? /* Skeleton album cards */
              [...Array(8)].map((_, i) => (
                <div key={i} className="group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted animate-pulse mb-2">
                    <div className="w-full h-full flex items-center justify-center">
                      <Disc3 className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            : hasAlbums
              ? /* Real album cards */
                albums.slice(0, 8).map(
                  (album) => (
                    <div key={album.id} className="group cursor-pointer">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-2 ring-1 ring-border transition-all group-hover:ring-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10">
                        {album.coverUrl ? (
                          <img
                            src={album.coverUrl}
                            alt={album.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Disc3 className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">
                        {album.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {album.artist?.name ?? "Artista"}
                      </p>
                    </div>
                  )
                )
              : /* Demo skeleton album cards with real covers */
                DEMO_COVERS.map((cover, i) => (
                  <div key={i} className="group cursor-default opacity-60">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-2 ring-1 ring-border relative">
                      <img
                        src={cover}
                        alt={DEMO_ALBUMS[i].title}
                        className="w-full h-full object-cover blur-[2px] grayscale"
                      />
                      <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
                        <Disc3 className="h-8 w-8 text-muted-foreground animate-spin" style={{ animationDuration: "3s" }} />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-foreground/50 truncate">
                      {DEMO_ALBUMS[i].title}
                    </p>
                    <p className="text-xs text-muted-foreground/50 truncate">
                      {DEMO_ALBUMS[i].artist}
                    </p>
                  </div>
                ))}
        </div>
      </div>

      {/* Bottom row: Recent sessions + Quick actions */}
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
                  <div key={i} className="flex items-center gap-4 rounded-lg bg-background/50 p-3 border border-border">
                    <Skeleton className="h-12 w-12 rounded-md shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Skeleton key={j} className="h-3.5 w-3.5 rounded-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : recentSessions.length === 0 ? (
              <div className="text-center py-8">
                <Headphones className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm">
                  Nenhuma sessao registrada ainda.
                </p>
                <Link href="/app/listening">
                  <Button variant="outline" size="sm" className="mt-3 gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> Registrar sessao
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSessions.map(
                  (s) => (
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
