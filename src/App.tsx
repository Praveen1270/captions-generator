import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Player } from '@remotion/player';
import { Upload, Paintbrush, Clock, Wand2, Play, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import './App.css';

interface Caption {
  text: string;
  startTime: number;
  endTime: number;
  color: string;
  fontSize: number;
  position: { x: number; y: number };
  font: string;
  group: string;
}

function App() {
  const { toast } = useToast();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [selectedCaption, setSelectedCaption] = useState(0);

  const fonts = [
    "Inter",
    "Roboto",
    "Poppins",
    "SF Pro Display",
    "Montserrat"
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      processVideo(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a video file",
        variant: "destructive"
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    maxFiles: 1
  });

  const processVideo = async (file: File) => {
    setIsProcessing(true);
    try {
      // Simulate ElevenLabs API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock captions for demonstration
      setCaptions([
        {
          text: "Generated caption example",
          startTime: 0,
          endTime: 2,
          color: "#ffffff",
          fontSize: 24,
          position: { x: 50, y: 80 },
          font: "Inter",
          group: "default"
        }
      ]);
      
      toast({
        title: "Success",
        description: "Video processed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process video",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const updateCaption = (index: number, updates: Partial<Caption>) => {
    setCaptions(prev => prev.map((cap, i) => 
      i === index ? { ...cap, ...updates } : cap
    ));
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {!videoFile ? (
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? "Drop the video here" : "Upload your video"}
            </h3>
            <p className="text-muted-foreground">
              Drag and drop a video file, or click to select
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {/* Video Preview */}
            <div className="space-y-4">
              <Card className="overflow-hidden">
                {videoUrl && (
                  <Player
                    component={() => (
                      <video src={videoUrl} style={{ width: '100%' }} />
                    )}
                    durationInFrames={1000}
                    compositionWidth={1920}
                    compositionHeight={1080}
                    fps={30}
                    controls
                  />
                )}
              </Card>
              
              {isProcessing && (
                <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Processing video...</span>
                </div>
              )}
            </div>

            {/* Caption Editor */}
            <div className="space-y-4">
              <Card className="p-6">
                <Tabs defaultValue="captions" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="captions">
                      <Paintbrush className="w-4 h-4 mr-2" />
                      Captions
                    </TabsTrigger>
                    <TabsTrigger value="timing">
                      <Clock className="w-4 h-4 mr-2" />
                      Timing
                    </TabsTrigger>
                    <TabsTrigger value="style">
                      <Wand2 className="w-4 h-4 mr-2" />
                      Style
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="captions" className="space-y-4">
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      {captions.map((caption, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg mb-2 cursor-pointer ${
                            selectedCaption === index
                              ? 'bg-primary/10'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedCaption(index)}
                        >
                          <Input
                            value={caption.text}
                            onChange={(e) =>
                              updateCaption(index, { text: e.target.value })
                            }
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            {caption.startTime}s - {caption.endTime}s
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="timing" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Start Time (seconds)</Label>
                      <Input 
                        type="number"
                        min={0}
                        step={0.1}
                        value={captions[selectedCaption]?.startTime}
                        onChange={(e) => updateCaption(selectedCaption, { 
                          startTime: parseFloat(e.target.value) 
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>End Time (seconds)</Label>
                      <Input 
                        type="number"
                        min={0}
                        step={0.1}
                        value={captions[selectedCaption]?.endTime}
                        onChange={(e) => updateCaption(selectedCaption, { 
                          endTime: parseFloat(e.target.value) 
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Caption Group</Label>
                      <Input 
                        value={captions[selectedCaption]?.group}
                        onChange={(e) => updateCaption(selectedCaption, { 
                          group: e.target.value 
                        })}
                        placeholder="Group name"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="style" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Input 
                        type="color" 
                        value={captions[selectedCaption]?.color}
                        onChange={(e) => updateCaption(selectedCaption, { 
                          color: e.target.value 
                        })}
                        className="h-10 w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Slider
                        value={[captions[selectedCaption]?.fontSize || 24]}
                        min={12}
                        max={72}
                        step={1}
                        onValueChange={([value]) => updateCaption(selectedCaption, { 
                          fontSize: value 
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Font Family</Label>
                      <Select 
                        value={captions[selectedCaption]?.font}
                        onValueChange={(value) => updateCaption(selectedCaption, { 
                          font: value 
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fonts.map(font => (
                            <SelectItem key={font} value={font}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 flex justify-end space-x-2">
                  <Button variant="outline">
                    Reset
                  </Button>
                  <Button>
                    <Play className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;