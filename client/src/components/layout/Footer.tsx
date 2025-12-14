import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

export function Footer() {
  const socialLinks = {
    facebook: "https://facebook.com/horeqshop",
    instagram: "https://instagram.com/horeqshop",
    twitter: "https://twitter.com/horeqshop",
    youtube: "https://youtube.com/@horeqshop",
    tiktok: "https://tiktok.com/@horeqshop"
  };

  return (
    <footer className="bg-primary/5 pt-16 pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/attached_assets/horeq_1765711133478.jpg" alt="Horeq" className="h-8 w-8 rounded-full object-cover" />
              <span className="text-xl font-bold font-heading text-primary">Horeq</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your one-stop destination for quality products at unbeatable prices. 
              We bring the world's best brands directly to your doorstep.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" data-testid="link-facebook">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-primary/20 text-primary hover:bg-primary hover:text-white">
                  <Facebook className="h-4 w-4" />
                </Button>
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" data-testid="link-instagram">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-primary/20 text-primary hover:bg-primary hover:text-white">
                  <Instagram className="h-4 w-4" />
                </Button>
              </a>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" data-testid="link-twitter">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-primary/20 text-primary hover:bg-primary hover:text-white">
                  <Twitter className="h-4 w-4" />
                </Button>
              </a>
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" data-testid="link-youtube">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-primary/20 text-primary hover:bg-primary hover:text-white">
                  <Youtube className="h-4 w-4" />
                </Button>
              </a>
              <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" data-testid="link-tiktok">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-primary/20 text-primary hover:bg-primary hover:text-white">
                  <SiTiktok className="h-4 w-4" />
                </Button>
              </a>
            </div>
            <p className="text-xs text-muted-foreground pt-2">Follow us: @horeqshop on all platforms</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors" data-testid="link-about">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors" data-testid="link-contact">Contact Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors" data-testid="link-careers">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors" data-testid="link-blog">Blog</Link></li>
              <li><Link href="/affiliate" className="hover:text-primary transition-colors" data-testid="link-footer-affiliate">Affiliate Program</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Customer Care</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary transition-colors" data-testid="link-help">Help Center</Link></li>
              <li><Link href="/how-to-buy" className="hover:text-primary transition-colors" data-testid="link-howtobuy">How to Buy</Link></li>
              <li><Link href="/track-order" className="hover:text-primary transition-colors" data-testid="link-track">Track Your Order</Link></li>
              <li><Link href="/returns" className="hover:text-primary transition-colors" data-testid="link-returns">Returns & Refunds</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors" data-testid="link-terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Stay in the Loop</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Your email address" className="bg-background border-primary/20" data-testid="input-newsletter" />
              <Button className="bg-primary text-white hover:bg-primary/90" data-testid="button-newsletter">
                Join
              </Button>
            </div>
            
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:support@horeq.com" className="hover:text-primary transition-colors">support@horeq.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+15551234567" className="hover:text-primary transition-colors">+1 (555) 123-4567</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>123 Commerce St, New York, NY</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 Horeq Online Shopping. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" alt="Paypal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
}
