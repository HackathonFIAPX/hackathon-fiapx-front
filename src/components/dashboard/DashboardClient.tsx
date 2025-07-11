"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { VideoList, type Video } from './VideoList';
import { UploadVideoDialog } from './UploadVideoDialog';
import { useRouter } from "next/navigation";
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

const initialVideos: Video[] = [];

export function DashboardClient() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);

  const baseURL = "https://uaxin4s2g9.execute-api.us-west-2.amazonaws.com/admin-api"
  const defaultAxios = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  useEffect(() => {
    // Simula a recuperação de vídeos do servidor
    const fetchVideos = async () => {
      // Aqui você pode fazer uma chamada real para a API
      // Simulando com um timeout
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Token não encontrado. Usuário não autenticado.");
        router.push('/'); // Redireciona para a página de login
        toast({
          variant: "destructive",
          title: "Acesso Negado",
          description: "Você precisa estar logado para acessar esta página.",
        })
        return;
      }

      try {
        const result = await defaultAxios.get('/v1/videos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Dados recebidos:", result);
        const videosData = result.data || [];
        console.log("Vídeos recuperados:", videosData);

        if (videos.length === 0) {
          console.log('Carregando vídeos... sem esperar 2 segundos');
          setVideos(videosData.map((video: any) => ({
            id: video.id,
            name: video.name,
            status: video.status,
          })));
        } else {
          console.log('Esperando 2 segundos para simular carregamento...');
          setTimeout(() => {
            setVideos(videosData.map((video: any) => ({
              id: video.id,
              name: video.name,
              status: video.status,
            })));
          }, 2000)
        }
      } catch (error) {
        console.error("Erro ao buscar vídeos:", error);
        return;
      }
    };

    fetchVideos();
  }, [videos])

  const handleUploadSuccess = (newVideoName: string) => {
    // const newVideo: Video = {
    //   id: (videos.length + 1).toString(),
    //   name: newVideoName,
    //   status: 'FAILED',
    // };
    // setVideos(prevVideos => [newVideo, ...prevVideos]);
    setUploadDialogOpen(false);
  };

  return (
    <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-headline gradient-text">Seus Vídeos</h1>
          <Button onClick={() => setUploadDialogOpen(true)} className="gradient-button">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Vídeo
          </Button>
        </div>
        <VideoList videos={videos} />
        <UploadVideoDialog 
            isOpen={isUploadDialogOpen}
            onOpenChange={setUploadDialogOpen}
            onUploadSuccess={handleUploadSuccess}
        />
    </div>
  );
}
