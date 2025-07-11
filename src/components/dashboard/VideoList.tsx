"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, AlertTriangle, RefreshCw, CheckCircle, UploadCloud, Film } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/router";

export type Video = {
  id: string;
  name: string;
  status: 'UPLOAD_PENDING' | 'UPLOADED' | 'CONVERTING_TO_FPS' | 'FINISHED' | 'FAILED';
};

interface VideoListProps {
  videos: Video[];
}

const statusConfig = {
    'UPLOAD_PENDING': {
      label: 'Upload Pendente',
      icon: UploadCloud,
      color: '#fcab04',
    },
    'UPLOADED': {
      label: 'Enviado',
      icon: CheckCircle,
      color: '#f46c14',
    },
    'CONVERTING_TO_FPS': {
      label: 'Convertendo',
      icon: RefreshCw,
      color: '#e42c64',
    },
    'FINISHED': {
      label: 'Concluído',
      icon: Film,
      color: '#de348a',
    },
    'FAILED': {
      label: 'Falha',
      icon: AlertTriangle,
      color: 'hsl(var(--destructive))',
    },
  };

const StatusBadge = ({ status }: { status: Video['status'] }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    const isSpinning = status === 'CONVERTING_TO_FPS';
  
    return (
      <Badge style={{ backgroundColor: config.color, color: 'white' }} className="border-none text-white">
        <Icon className={`mr-2 h-4 w-4 ${isSpinning ? 'animate-spin' : ''}`} />
        {config.label}
      </Badge>
    );
  };

export function VideoList({ videos }: VideoListProps) {
  const { toast } = useToast();
  const router = useRouter();

  const baseURL = "https://uaxin4s2g9.execute-api.us-west-2.amazonaws.com/admin-api"
  const defaultAxios = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  async function handleDownload(videoId: string) {
    console.log("Iniciando download do vídeo:", videoId);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        console.error("Token não encontrado. Usuário não autenticado.");
        toast({
          variant: "destructive",
          title: "Acesso Negado",
          description: "Você precisa estar logado para baixar vídeos.",
        });
        router.push('/');
        return;
      }

      const presignedUrl = await defaultAxios.get(`/v1/videos/${videoId}/download/zip`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await axios.get(presignedUrl.data, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${videoId}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao baixar o vídeo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao baixar",
        description: "Ocorreu um erro ao tentar baixar o zip do video. Por favor, tente novamente.",
      })
    }
  }
  return (
    <div className="rounded-lg gradient-border">
        <div className="bg-card rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[50%] md:w-[60%]">Vídeo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {videos.map((video) => (
                <TableRow key={video.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium font-code text-foreground/90 truncate">{video.name}</TableCell>
                    <TableCell>
                    <StatusBadge status={video.status} />
                    </TableCell>
                    <TableCell className="text-right">
                    <Button size="sm" disabled={video.status !== 'FINISHED'} onClick={() => handleDownload(video.id)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Zip
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
    </div>
  );
}
