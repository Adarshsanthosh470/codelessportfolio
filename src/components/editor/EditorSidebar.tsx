import { useEditor } from "@/contexts/EditorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Link as LinkIcon, 
  Palette,
  Type,
  Plus,
  Trash2,
  Image,
  Building2
} from "lucide-react";
import { useState } from "react";
import { Education, Experience } from "@/types/portfolio";

const EditorSidebar = () => {
  const { state, updatePortfolioData, updateCustomColors, updateCustomFont } = useEditor();
  const { portfolioData, customColors, customFont } = state;
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      updatePortfolioData({
        skills: [...portfolioData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    updatePortfolioData({
      skills: portfolioData.skills.filter((_, i) => i !== index),
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePortfolioData({ photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEducation: Education = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
    };
    updatePortfolioData({
      education: [...portfolioData.education, newEducation],
    });
  };

  const handleUpdateEducation = (id: string, updates: Partial<Education>) => {
    updatePortfolioData({
      education: portfolioData.education.map((edu) =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
    });
  };

  const handleRemoveEducation = (id: string) => {
    updatePortfolioData({
      education: portfolioData.education.filter((edu) => edu.id !== id),
    });
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: `exp-${Date.now()}`,
      company: "",
      position: "",
      description: "",
      startYear: "",
      endYear: "",
      current: false,
    };
    updatePortfolioData({
      experience: [...(portfolioData.experience || []), newExperience],
    });
  };

  const handleUpdateExperience = (id: string, updates: Partial<Experience>) => {
    updatePortfolioData({
      experience: (portfolioData.experience || []).map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    });
  };

  const handleRemoveExperience = (id: string) => {
    updatePortfolioData({
      experience: (portfolioData.experience || []).filter((exp) => exp.id !== id),
    });
  };

  const fonts = ["Inter", "Outfit", "Poppins", "Roboto", "Playfair Display"];

  return (
    <div className="w-80 bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="font-display font-semibold text-lg">Edit Portfolio</h2>
        <p className="text-sm text-muted-foreground">Customize your content</p>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="w-full justify-start px-4 pt-4 bg-transparent">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Style
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="p-4 space-y-6">
          {/* Profile Section */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Profile
            </h3>
            
            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Photo</Label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border">
                  {portfolioData.photo ? (
                    <img src={portfolioData.photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Image className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={portfolioData.name}
                onChange={(e) => updatePortfolioData({ name: e.target.value })}
                placeholder="Your Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={portfolioData.title}
                onChange={(e) => updatePortfolioData({ title: e.target.value })}
                placeholder="Software Developer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={portfolioData.bio}
                onChange={(e) => updatePortfolioData({ bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Skills
            </h3>
            
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <Button size="icon" variant="outline" onClick={handleAddSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {portfolioData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(index)}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                Education
              </h3>
              <Button size="sm" variant="outline" onClick={handleAddEducation}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            {portfolioData.education.map((edu) => (
              <div key={edu.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <Label className="text-xs text-muted-foreground">Education Entry</Label>
                  <button
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <Input
                  value={edu.institution}
                  onChange={(e) => handleUpdateEducation(edu.id, { institution: e.target.value })}
                  placeholder="Institution Name"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={edu.degree}
                    onChange={(e) => handleUpdateEducation(edu.id, { degree: e.target.value })}
                    placeholder="Degree"
                  />
                  <Input
                    value={edu.field}
                    onChange={(e) => handleUpdateEducation(edu.id, { field: e.target.value })}
                    placeholder="Field of Study"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={edu.startYear}
                    onChange={(e) => handleUpdateEducation(edu.id, { startYear: e.target.value })}
                    placeholder="Start Year"
                  />
                  <Input
                    value={edu.endYear}
                    onChange={(e) => handleUpdateEducation(edu.id, { endYear: e.target.value })}
                    placeholder="End Year"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Experience Section (Optional) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Experience
                <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </h3>
              <Button size="sm" variant="outline" onClick={handleAddExperience}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            {(portfolioData.experience || []).map((exp) => (
              <div key={exp.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <Label className="text-xs text-muted-foreground">Experience Entry</Label>
                  <button
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <Input
                  value={exp.company}
                  onChange={(e) => handleUpdateExperience(exp.id, { company: e.target.value })}
                  placeholder="Company Name"
                />
                <Input
                  value={exp.position}
                  onChange={(e) => handleUpdateExperience(exp.id, { position: e.target.value })}
                  placeholder="Position / Job Title"
                />
                <Textarea
                  value={exp.description}
                  onChange={(e) => handleUpdateExperience(exp.id, { description: e.target.value })}
                  placeholder="Brief description of your role..."
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={exp.startYear}
                    onChange={(e) => handleUpdateExperience(exp.id, { startYear: e.target.value })}
                    placeholder="Start Year"
                  />
                  <Input
                    value={exp.current ? "Present" : exp.endYear}
                    onChange={(e) => handleUpdateExperience(exp.id, { endYear: e.target.value, current: e.target.value.toLowerCase() === 'present' })}
                    placeholder="End Year"
                    disabled={exp.current}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={exp.current}
                    onCheckedChange={(checked) => handleUpdateExperience(exp.id, { current: checked, endYear: checked ? "Present" : "" })}
                  />
                  <Label className="text-sm text-muted-foreground">Currently working here</Label>
                </div>
              </div>
            ))}

            {(!portfolioData.experience || portfolioData.experience.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">
                No experience added yet. Click "Add" to include your work history.
              </p>
            )}
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-primary" />
              Social Links
            </h3>
            
            {portfolioData.socialLinks.map((link, index) => (
              <div key={link.id} className="space-y-2">
                <Label className="capitalize">{link.platform}</Label>
                <Input
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...portfolioData.socialLinks];
                    newLinks[index] = { ...link, url: e.target.value };
                    updatePortfolioData({ socialLinks: newLinks });
                  }}
                  placeholder={`https://${link.platform}.com/...`}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="style" className="p-4 space-y-6">
          {/* Colors */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              Colors
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.primary}
                    onChange={(e) => updateCustomColors({ primary: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <Input
                    value={customColors.primary}
                    onChange={(e) => updateCustomColors({ primary: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secondary</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.secondary}
                    onChange={(e) => updateCustomColors({ secondary: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <Input
                    value={customColors.secondary}
                    onChange={(e) => updateCustomColors({ secondary: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Background</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.background}
                    onChange={(e) => updateCustomColors({ background: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <Input
                    value={customColors.background}
                    onChange={(e) => updateCustomColors({ background: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.text}
                    onChange={(e) => updateCustomColors({ text: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <Input
                    value={customColors.text}
                    onChange={(e) => updateCustomColors({ text: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fonts */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" />
              Font
            </h3>
            
            <div className="grid gap-2">
              {fonts.map((font) => (
                <button
                  key={font}
                  onClick={() => updateCustomFont(font)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    customFont === font
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorSidebar;
