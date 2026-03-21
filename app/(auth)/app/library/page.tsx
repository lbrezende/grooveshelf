"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, Trash2, Music, Disc3 } from "lucide-react";
import { safeFetchArray } from "@/lib/safe-fetch";

interface Artist {
  id: string;
  name: string;
  genre?: string;
  imageUrl?: string;
  spotifyId?: string;
}

interface Album {
  id: string;
  title: string;
  year?: number;
  coverUrl?: string;
  label?: string;
  artistId: string;
  artist?: Artist;
}

export default function LibraryPage() {
  const queryClient = useQueryClient();
  const [artistDialogOpen, setArtistDialogOpen] = useState(false);
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);

  // Artist form state
  const [artistName, setArtistName] = useState("");
  const [artistGenre, setArtistGenre] = useState("");
  const [artistImageUrl, setArtistImageUrl] = useState("");
  const [artistSpotifyId, setArtistSpotifyId] = useState("");

  // Album form state
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumYear, setAlbumYear] = useState("");
  const [albumCoverUrl, setAlbumCoverUrl] = useState("");
  const [albumLabel, setAlbumLabel] = useState("");
  const [albumArtistId, setAlbumArtistId] = useState("");

  // Queries
  const { data: artists = [], isLoading: loadingArtists } = useQuery<Artist[]>({
    queryKey: ["artists"],
    queryFn: () => safeFetchArray<Artist>("/api/artists"),
  });

  const { data: albums = [], isLoading: loadingAlbums } = useQuery<Album[]>({
    queryKey: ["albums"],
    queryFn: () => safeFetchArray<Album>("/api/albums"),
  });

  // Mutations - Artists
  const createArtist = useMutation({
    mutationFn: (data: Partial<Artist>) =>
      fetch("/api/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      toast.success("Artista adicionado!");
      resetArtistForm();
      setArtistDialogOpen(false);
    },
    onError: () => {
      toast.error("Erro ao adicionar artista.");
    },
  });

  const deleteArtist = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/artists?id=${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      toast.success("Artista removido!");
    },
    onError: () => {
      toast.error("Erro ao remover artista.");
    },
  });

  // Mutations - Albums
  const createAlbum = useMutation({
    mutationFn: (data: Partial<Album>) =>
      fetch("/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      toast.success("Album adicionado!");
      resetAlbumForm();
      setAlbumDialogOpen(false);
    },
    onError: () => {
      toast.error("Erro ao adicionar album.");
    },
  });

  const deleteAlbum = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/albums?id=${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      toast.success("Album removido!");
    },
    onError: () => {
      toast.error("Erro ao remover album.");
    },
  });

  function resetArtistForm() {
    setArtistName("");
    setArtistGenre("");
    setArtistImageUrl("");
    setArtistSpotifyId("");
  }

  function resetAlbumForm() {
    setAlbumTitle("");
    setAlbumYear("");
    setAlbumCoverUrl("");
    setAlbumLabel("");
    setAlbumArtistId("");
  }

  function handleCreateArtist() {
    if (!artistName.trim()) {
      toast.error("Nome do artista e obrigatorio.");
      return;
    }
    createArtist.mutate({
      name: artistName,
      genre: artistGenre || undefined,
      imageUrl: artistImageUrl || undefined,
      spotifyId: artistSpotifyId || undefined,
    });
  }

  function handleCreateAlbum() {
    if (!albumTitle.trim() || !albumArtistId) {
      toast.error("Titulo e artista sao obrigatorios.");
      return;
    }
    createAlbum.mutate({
      title: albumTitle,
      year: albumYear ? parseInt(albumYear) : undefined,
      coverUrl: albumCoverUrl || undefined,
      label: albumLabel || undefined,
      artistId: albumArtistId,
    });
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Biblioteca <span className="text-primary">Musical</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie seus artistas e albuns favoritos.
        </p>
      </div>

      <Tabs defaultValue="artists">
        <TabsList>
          <TabsTrigger value="artists">Artistas</TabsTrigger>
          <TabsTrigger value="albums">Albuns</TabsTrigger>
        </TabsList>

        {/* === Artists Tab === */}
        <TabsContent value="artists">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              {artists.length} artista{artists.length !== 1 ? "s" : ""}
            </h2>
            <Dialog open={artistDialogOpen} onOpenChange={setArtistDialogOpen}>
              <DialogTrigger
                render={
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Adicionar Artista
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Artista</DialogTitle>
                  <DialogDescription>
                    Adicione um artista a sua biblioteca.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="artist-name">Nome *</Label>
                    <Input
                      id="artist-name"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="Ex: Radiohead"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="artist-genre">Genero</Label>
                    <Input
                      id="artist-genre"
                      value={artistGenre}
                      onChange={(e) => setArtistGenre(e.target.value)}
                      placeholder="Ex: Rock Alternativo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="artist-image">URL da imagem</Label>
                    <Input
                      id="artist-image"
                      value={artistImageUrl}
                      onChange={(e) => setArtistImageUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="artist-spotify">Spotify ID</Label>
                    <Input
                      id="artist-spotify"
                      value={artistSpotifyId}
                      onChange={(e) => setArtistSpotifyId(e.target.value)}
                      placeholder="ID do Spotify (opcional)"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateArtist}
                    disabled={createArtist.isPending}
                  >
                    {createArtist.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loadingArtists ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : artists.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Nenhum artista ainda. Adicione o primeiro!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {artists.map((artist) => (
                <Card key={artist.id} className="bg-card border-border group relative">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {artist.imageUrl ? (
                        <img
                          src={artist.imageUrl}
                          alt={artist.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                          <Music className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {artist.name}
                        </p>
                        {artist.genre && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {artist.genre}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteArtist.mutate(artist.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* === Albums Tab === */}
        <TabsContent value="albums">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              {albums.length} album{albums.length !== 1 ? "s" : ""}
            </h2>
            <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
              <DialogTrigger
                render={
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Adicionar Album
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Album</DialogTitle>
                  <DialogDescription>
                    Adicione um album a sua biblioteca.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="album-title">Titulo *</Label>
                    <Input
                      id="album-title"
                      value={albumTitle}
                      onChange={(e) => setAlbumTitle(e.target.value)}
                      placeholder="Ex: OK Computer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="album-artist">Artista *</Label>
                    <Select value={albumArtistId} onValueChange={(v) => setAlbumArtistId(v ?? "")}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um artista" />
                      </SelectTrigger>
                      <SelectContent>
                        {artists.map((artist) => (
                          <SelectItem key={artist.id} value={artist.id}>
                            {artist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="album-year">Ano</Label>
                      <Input
                        id="album-year"
                        type="number"
                        value={albumYear}
                        onChange={(e) => setAlbumYear(e.target.value)}
                        placeholder="1997"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="album-label">Gravadora</Label>
                      <Input
                        id="album-label"
                        value={albumLabel}
                        onChange={(e) => setAlbumLabel(e.target.value)}
                        placeholder="Ex: Capitol"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="album-cover">URL da capa</Label>
                    <Input
                      id="album-cover"
                      value={albumCoverUrl}
                      onChange={(e) => setAlbumCoverUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateAlbum}
                    disabled={createAlbum.isPending}
                  >
                    {createAlbum.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loadingAlbums ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : albums.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Disc3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Nenhum album ainda. Adicione o primeiro!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {albums.map((album) => (
                <Card key={album.id} className="bg-card border-border group relative overflow-hidden">
                  {album.coverUrl ? (
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-muted flex items-center justify-center">
                      <Disc3 className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <p className="font-semibold text-foreground truncate">
                      {album.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {album.artist?.name ?? "Artista desconhecido"}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      {album.year && <span>{album.year}</span>}
                      {album.year && album.label && <span>&middot;</span>}
                      {album.label && <span>{album.label}</span>}
                    </div>
                  </CardContent>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteAlbum.mutate(album.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
