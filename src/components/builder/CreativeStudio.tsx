import { useState } from "react";
import { Sparkles, Copy, Image, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

interface Variant {
  headline: string;
  short: string;
  long: string;
  description: string;
}

const defaultAngles = [
  {
    id: "value",
    label: "Value Proposition",
    variants: [
      { headline: "Premium Quality at Unbeatable Prices", short: "Shop top-rated products with free returns.", long: "Discover our curated collection of premium electronics. Every item comes with a 2-year warranty and free express shipping. Join 50K+ satisfied customers.", description: "Electronics • Free Shipping" },
      { headline: "Your Home, Upgraded", short: "Smart home essentials starting at $29.", long: "Transform your living space with our smart home collection. Easy setup, works with all major platforms, and backed by our satisfaction guarantee.", description: "Smart Home • Easy Setup" },
    ]
  },
  {
    id: "urgency",
    label: "Urgency",
    variants: [
      { headline: "48 Hours Left — Don't Miss Out", short: "Flash sale ends tonight. Up to 40% off.", long: "Our biggest sale of the season is almost over. Top-selling items are going fast — over 2,000 units sold today alone. Grab yours before they're gone.", description: "Flash Sale • Limited Time" },
      { headline: "Last Chance: Spring Collection", short: "Final markdowns on spring favorites.", long: "This is your last opportunity to shop our spring collection at these prices. Once they're gone, they're gone for good. Act now.", description: "Final Markdown • Spring" },
    ]
  },
  {
    id: "social",
    label: "Social Proof",
    variants: [
      { headline: "Join 50,000+ Happy Customers", short: "See why we're rated 4.8 stars.", long: "Over 50,000 customers have upgraded their setup with us. With a 4.8-star average rating and 96% satisfaction rate, you're in good company.", description: "4.8 Stars • 50K+ Customers" },
      { headline: "As Featured In Tech Weekly", short: "Award-winning products, trusted by pros.", long: "Named 'Best Value' by Tech Weekly three years running. Our products are trusted by professionals and loved by everyday users.", description: "Award-Winning • Trusted" },
    ]
  },
];

const imagePrompts = [
  { format: "1:1", channel: "Meta Feed", prompt: "Product lifestyle shot, clean background" },
  { format: "4:5", channel: "Instagram", prompt: "Hero product with model, warm lighting" },
  { format: "9:16", channel: "Stories/Reels", prompt: "Dynamic vertical creative, bold typography" },
];

export function CreativeStudio({ onNext, onBack }: Props) {
  const [selectedAngle, setSelectedAngle] = useState("value");
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [generatingCopy, setGeneratingCopy] = useState(false);
  const [angles, setAngles] = useState(defaultAngles);

  const currentAngle = angles.find(a => a.id === selectedAngle)!;

  const handleGenerateImage = async (format: string, prompt: string) => {
    setGeneratingImage(format);
    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt, format },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setGeneratedImages(prev => ({ ...prev, [format]: data.imageUrl }));
      toast.success(`Image generated for ${format}`);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to generate image");
    } finally {
      setGeneratingImage(null);
    }
  };

  const handleGenerateCopy = async () => {
    setGeneratingCopy(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-copy", {
        body: { angle: selectedAngle, productCategory: "general e-commerce", brandTone: "professional" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.variants) {
        setAngles(prev => prev.map(a =>
          a.id === selectedAngle ? { ...a, variants: data.variants } : a
        ));
        toast.success("Copy generated with AI!");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to generate copy");
    } finally {
      setGeneratingCopy(false);
    }
  };

  const handleCopyText = (variant: Variant) => {
    const text = `${variant.headline}\n${variant.short}\n${variant.long}`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Angle Selection */}
      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Creative Angles</h2>
          <button
            onClick={handleGenerateCopy}
            disabled={generatingCopy}
            className="px-4 py-2 bg-primary/10 text-primary rounded-md text-xs font-medium hover:bg-primary/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {generatingCopy ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            {generatingCopy ? "Generating..." : "AI Generate Copy"}
          </button>
        </div>
        <div className="flex gap-2 mb-6">
          {angles.map((angle) => (
            <button
              key={angle.id}
              onClick={() => setSelectedAngle(angle.id)}
              className={cn(
                "px-4 py-2 rounded-md text-xs font-medium border transition-colors",
                selectedAngle === angle.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
              )}
            >
              {angle.label}
            </button>
          ))}
        </div>

        {/* Variants */}
        <div className="space-y-4">
          {currentAngle.variants.map((variant, i) => (
            <div key={i} className="border border-border rounded-lg p-4 bg-secondary/20">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Variant {i + 1}</span>
                <button onClick={() => handleCopyText(variant)} className="text-xs text-primary flex items-center gap-1 hover:opacity-80">
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{variant.headline}</h3>
              <p className="text-sm text-foreground mb-1">{variant.short}</p>
              <p className="text-xs text-muted-foreground mb-2">{variant.long}</p>
              <span className="text-[10px] px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">{variant.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Image Generation */}
      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <h2 className="text-base font-semibold text-foreground mb-4">Image Generation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {imagePrompts.map((img) => (
            <div key={img.format} className="border border-border rounded-lg p-4 bg-secondary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-primary">{img.format}</span>
                <span className="text-[10px] text-muted-foreground">{img.channel}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{img.prompt}</p>
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center mb-3 overflow-hidden">
                {generatingImage === img.format ? (
                  <div className="flex flex-col items-center gap-2 text-xs text-primary">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Generating with AI...
                  </div>
                ) : generatedImages[img.format] ? (
                  <img src={generatedImages[img.format]} alt={`Generated ${img.format}`} className="w-full h-full object-cover" />
                ) : (
                  <Image className="h-8 w-8 text-muted-foreground/30" />
                )}
              </div>
              <button
                onClick={() => handleGenerateImage(img.format, img.prompt)}
                disabled={generatingImage === img.format}
                className="w-full px-3 py-2 bg-primary/10 text-primary rounded-md text-xs font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3" />
                {generatedImages[img.format] ? "Regenerate" : "Generate Image"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Style Rules */}
      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <h2 className="text-base font-semibold text-foreground mb-4">Brand Style Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary/30 rounded-md p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Colors</p>
            <div className="flex gap-2">
              {["#0EA5E9", "#10B981", "#1E293B", "#F8FAFC"].map(c => (
                <div key={c} className="h-6 w-6 rounded-full border border-border" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="bg-secondary/30 rounded-md p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Do</p>
            <ul className="text-xs text-foreground space-y-1">
              <li>✓ Use approved brand colors</li>
              <li>✓ Include CTA in every creative</li>
              <li>✓ Follow accessibility guidelines</li>
            </ul>
          </div>
          <div className="bg-secondary/30 rounded-md p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Don't</p>
            <ul className="text-xs text-foreground space-y-1">
              <li>✗ Use competitor brand names</li>
              <li>✗ Make unverified claims</li>
              <li>✗ Use all-caps headlines</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">← Back</button>
        <button onClick={onNext} className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">Continue to Channels →</button>
      </div>
    </div>
  );
}
