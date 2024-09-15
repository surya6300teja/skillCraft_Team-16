import { useState } from 'react'

import { Upload, FileText, ChevronRight } from 'lucide-react'
import { Button } from "./components/button"
import { Input } from "./components/input"
import { Textarea } from "./components/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/tabs"
import { Label } from "./components/label"


function App() {
  const [isManualInputActive, setIsManualInputActive] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    skills: '',
    workExperience: '',
  });

  const handleFileChange = (event) => {
    // ... your file upload logic
  };

  const handleManualInput = () => {
    setIsManualInputActive(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAnalyzeResume = () => {
    // If manual input is active, use the form data
    if (isManualInputActive) {
      // Implement your resume analysis logic using formData
      console.log("Analyzing resume using manual input data:", formData);
    } else {
      // Handle file upload case
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Resume AI Analyzer</h1>
      
      <Tabs defaultValue="upload" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Resume</TabsTrigger>
          <TabsTrigger value="manual">Manual Input</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Resume</CardTitle>
              <CardDescription>We accept PDF, DOC, or DOCX files.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, or DOCX (MAX. 5MB)</p>
                  </div>
                  <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
                </label>
              </div>
              {file && (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Selected file: {file.name}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSubmit} disabled={!file}>
                Analyze Resume
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Details</CardTitle>
              <CardDescription>Provide information about your skills and experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input 
                    type="text" 
                    id="skills" 
                    name="skills" 
                    value={formData.skills}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Work Experience</Label>
                  <Textarea 
                    id="experience" 
                    name="experience" 
                    rows={4} 
                    value={formData.experience}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full">
                  Analyze Information
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;