'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { 
  Database,
  Plus,
  Upload,
  Download,
  Trash2,
  Eye,
  Edit,
  Search,
  Filter,
  FileText,
  Users,
  Calendar
} from 'lucide-react'

interface Dataset {
  id: string
  name: string
  description: string
  itemCount: number
  createdAt: string
  updatedAt: string
  tags: string[]
  projectId: string
  projectName: string
}

export default function DatasetsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProject, setSelectedProject] = useState('all')

  useEffect(() => {
    if (user) {
      fetchDatasets()
    }
  }, [user])

  const fetchDatasets = async () => {
    try {
      setLoading(true)
      
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId')
      const headers: Record<string, string> = userId ? { 'Authorization': `Bearer ${userId}` } : {}
      
      const response = await fetch('/api/datasets', { headers })
      if (response.ok) {
        const data = await response.json()
        // Transform the data to match the interface
        const transformedDatasets = (data.datasets || []).map((dataset: any) => ({
          id: dataset.id,
          name: dataset.name,
          description: dataset.description || '',
          itemCount: dataset._count?.items || 0,
          createdAt: dataset.createdAt,
          updatedAt: dataset.updatedAt,
          tags: [], // Datasets don't have tags in the schema
          projectId: dataset.projectId,
          projectName: dataset.project?.name || 'Unknown Project'
        }))
        setDatasets(transformedDatasets)
      }
    } catch (error) {
      console.error('Error fetching datasets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDataset = () => {
    router.push('/dashboard/datasets/create')
  }

  const handleViewDataset = (id: string) => {
    router.push(`/dashboard/datasets/${id}`)
  }

  const handleEditDataset = (id: string) => {
    router.push(`/dashboard/datasets/${id}/edit`)
  }

  const handleDeleteDataset = async (id: string) => {
    if (confirm('Are you sure you want to delete this dataset?')) {
      try {
        // In a real app, you'd call the delete API
        setDatasets(prev => prev.filter(dataset => dataset.id !== id))
      } catch (error) {
        console.error('Error deleting dataset:', error)
      }
    }
  }

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProject = selectedProject === 'all' || dataset.projectId === selectedProject
    return matchesSearch && matchesProject
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to continue</h1>
          <Button onClick={() => router.push('/auth/signin')}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Datasets</h1>
          <p className="text-muted-foreground">
            Manage your test datasets for prompt evaluation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={handleCreateDataset}>
            <Plus className="w-4 h-4 mr-2" />
            Create Dataset
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="all">All Projects</option>
          <option value="1">Customer Support AI</option>
          <option value="2">Code Assistant</option>
          <option value="3">Email Generator</option>
        </select>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Datasets Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading datasets...</p>
        </div>
      ) : filteredDatasets.length === 0 ? (
        <Card className="text-center py-16 border-dashed border-2 border-muted-foreground/20">
          <CardContent>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Database className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">No datasets yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first dataset to start testing your prompts with real data. Datasets help you evaluate prompt performance across multiple test cases.
            </p>
            <Button className="bg-gradient-to-r from-promptrix-primary to-promptrix-secondary" onClick={handleCreateDataset}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Dataset
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset) => (
            <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{dataset.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {dataset.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDataset(dataset.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditDataset(dataset.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDataset(dataset.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-medium">{dataset.itemCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Project</span>
                    <span className="font-medium">{dataset.projectName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Updated</span>
                    <span className="font-medium">
                      {new Date(dataset.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {dataset.tags && dataset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {dataset.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-muted text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{datasets.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {datasets.reduce((sum, dataset) => sum + dataset.itemCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Test data points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(datasets.map(d => d.projectId)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              With datasets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {datasets.length > 0 
                ? new Date(Math.max(...datasets.map(d => new Date(d.updatedAt).getTime()))).toLocaleDateString()
                : 'Never'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Most recent change
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 