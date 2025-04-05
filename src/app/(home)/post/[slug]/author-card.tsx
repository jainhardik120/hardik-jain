import { Twitter, Linkedin, Globe } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import RandomAvatarImage from '@/lib/avatar-image';

interface AuthorProps {
  author: {
    name: string | null;
    image: string | null;
    bio: string;
    twitter: string | null;
    linkedin: string | null;
    website: string | null;
  };
}

export default function AuthorCard({ author }: AuthorProps) {
  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="flex flex-col sm:flex-row gap-6">
        <Avatar className="w-24 h-24 rounded-full shrink-0 mx-auto sm:mx-0">
          <RandomAvatarImage src={author?.image} alt={author?.name} />
        </Avatar>
        <div>
          <h5 className="text-xl font-bold mb-2 text-center sm:text-left">{author.name}</h5>
          <p className="text-muted-foreground mb-4">{author.bio}</p>
          <div className="flex space-x-2 justify-center sm:justify-start">
            {author.twitter !== null && author.twitter !== undefined && (
              <Button variant="outline" size="icon" asChild>
                <a
                  href={author.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${author.name}'s Twitter`}
                >
                  <Twitter size={18} />
                </a>
              </Button>
            )}
            {author.linkedin !== null && author.linkedin !== undefined && (
              <Button variant="outline" size="icon" asChild>
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${author.name}'s LinkedIn`}
                >
                  <Linkedin size={18} />
                </a>
              </Button>
            )}
            {author.website !== null && author.website !== undefined && (
              <Button variant="outline" size="icon" asChild>
                <a
                  href={author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${author.name}'s Website`}
                >
                  <Globe size={18} />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
