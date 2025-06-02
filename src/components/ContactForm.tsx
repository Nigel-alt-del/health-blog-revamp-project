
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, User, MessageSquare } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create mailto link with form data
    const subject = encodeURIComponent('Contact Form - Analysis & Information Request');
    const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Message:
${formData.message}
    `);
    
    const mailtoLink = `mailto:nigel@insuremyhealth.uk?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    
    toast({
      title: "Success",
      description: "Your email client should open now to send your message"
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-[#20466d]">Contact Our Analysis Team</CardTitle>
          <p className="text-[#79858D]">
            Need insights on employee benefits analysis or have questions? Get in touch with our expert team.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#20466d]">
                  <User className="inline w-4 h-4 mr-1" />
                  Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#20466d]">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="your.email@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#20466d]">
                <Phone className="inline w-4 h-4 mr-1" />
                Phone (Optional)
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+44 123 456 7890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#20466d]">
                <MessageSquare className="inline w-4 h-4 mr-1" />
                Message *
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder="Tell us about your analysis needs, questions about employee benefits, or any specific insights you're looking for..."
                rows={6}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#22aee1] hover:bg-[#20466d]"
            >
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;
