import { useState } from 'react';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '@/firebase'
import { useAuth } from '@/app/hooks/useAuth'
import { createListing } from '@/app/api/listings'
import { Upload, Image as ImageIcon, Video, Tag, DollarSign, FileText } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';

interface ItemUploadProps {
  onSuccess: () => void;
}

export function ItemUpload({ onSuccess }: ItemUploadProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null)
    if (!user) {
      setError('You must be signed in to upload an item.')
      return
    }
    if (!imageFile) {
      setError('Please select an image for the item.')
      return
    }

    const upload = async () => {
      try {
        setLoading(true)

        // upload image
        const imagePath = `images/${user.uid}/${Date.now()}_${imageFile.name}`
        const imgRef = storageRef(storage, imagePath)
        const imgSnap = await new Promise<any>((res, rej) => {
          const task = uploadBytesResumable(imgRef, imageFile)
          task.on(
            'state_changed',
            (snap) => {
              const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
              setProgress(pct)
            },
            (err) => rej(err),
            () => res(task.snapshot)
          )
        })
        const imageUrl = await getDownloadURL(imgSnap.ref)

        // upload video if present
        let videoUrl: string | undefined = undefined
        if (videoFile) {
          const videoPath = `videos/${user.uid}/${Date.now()}_${videoFile.name}`
          const vidRef = storageRef(storage, videoPath)
          const vidSnap = await new Promise<any>((res, rej) => {
            const task = uploadBytesResumable(vidRef, videoFile)
            task.on(
              'state_changed',
              (snap) => {
                const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
                setProgress(pct)
              },
              (err) => rej(err),
              () => res(task.snapshot)
            )
          })
          videoUrl = await getDownloadURL(vidSnap.ref)
        }

        // create listing in Firestore
        await createListing({
          ownerUid: user.uid,
          title,
          description,
          price: price ? Number(price) : undefined,
          imageUrl,
          status: 'active',
          tags,
        })

        alert('Item uploaded successfully!')
        onSuccess()
      } catch (err: any) {
        console.error(err)
        setError(err?.message || 'Upload failed')
      } finally {
        setLoading(false)
        setProgress(null)
      }
    }

    void upload()
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload New Item</h1>
          <p className="text-muted-foreground">
            List your item and start receiving bids from interested buyers
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Item Image *</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="image" className="cursor-pointer block">
                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Video Upload (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="video">Item Video (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                {videoFile ? (
                  <div className="space-y-4">
                    <Video className="w-12 h-12 mx-auto text-primary" />
                    <p className="text-sm">{videoFile.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setVideoFile(null)}
                    >
                      Remove Video
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="video" className="cursor-pointer block">
                    <Video className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload video
                    </p>
                    <p className="text-xs text-muted-foreground">MP4, MOV up to 50MB</p>
                    <input
                      id="video"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Vintage Camera in Excellent Condition"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item in detail..."
                rows={5}
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Starting Price *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Set your starting price. Buyers can bid higher amounts.
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="tags"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tags (e.g., Electronics, Vintage)"
                    className="pl-10"
                  />
                </div>
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <div>
                {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
                {progress !== null && (
                  <div className="text-sm mb-2">Uploading: {progress}%</div>
                )}
                <Button type="submit" className="w-full rounded-full" size="lg" disabled={loading}>
                  <Upload className="w-5 h-5 mr-2" />
                  {loading ? 'Uploading…' : 'Upload Item'}
                </Button>
              </div>
            </div>
          </Card>
        </form>

        {/* Trust Indicators */}
        <div className="mt-8 p-6 bg-secondary/30 rounded-lg">
          <h3 className="font-semibold mb-3">Why list on Listedio?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Secure escrow payments protect both buyers and sellers</li>
            <li>✓ Reach local buyers within a 10km radius</li>
            <li>✓ Accept bids to maximize your item's value</li>
            <li>✓ Verified buyer ratings and reviews</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
