'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNextAuth } from '@/hooks/use-nextauth'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Plus, 
  Search, 
  Mail,
  Crown,
  Shield,
  UserPlus,
  MoreVertical
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  joinedAt: string
  lastActive: string
}

export default function TeamPage() {
  const { user } = useNextAuth()
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    if (user) {
      fetchTeamMembers()
    }
  }, [user])

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/team')
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data.members || [])
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInviteMember = () => {
    setShowInviteModal(true)
  }

  const handleRemoveMember = async (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      try {
        setTeamMembers(prev => prev.filter(member => member.id !== id))
      } catch (error) {
        console.error('Error removing member:', error)
      }
    }
  }

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      setTeamMembers(prev => prev.map(member => 
        member.id === id ? { ...member, role: newRole } : member
      ))
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 'MEMBER':
        return <Shield className="h-4 w-4 text-blue-500" />
      case 'VIEWER':
        return <UserPlus className="h-4 w-4 text-gray-500" />
      default:
        return <UserPlus className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'inactive':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = true // No role filter in UI, so all members are shown
    return matchesSearch && matchesRole
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
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="text-muted-foreground">
            Manage your team members and permissions
          </p>
        </div>
        <Button onClick={handleInviteMember}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value="all" // No role filter in UI, so always "all"
          onChange={(e) => {}}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="all">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="MEMBER">Member</option>
          <option value="VIEWER">Viewer</option>
        </select>
        <Button variant="outline" size="sm">
          <MoreVertical className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Empty State */}
      {!loading && filteredMembers.length === 0 && (
        <Card className="text-center py-16 border-dashed border-2 border-muted-foreground/20">
          <CardContent>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">No team members yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Invite team members to collaborate on your prompts and projects. You can assign different roles and permissions to each member.
            </p>
            <Button className="bg-gradient-to-r from-promptrix-primary to-promptrix-secondary" onClick={handleInviteMember}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Your First Member
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading team members...</p>
        </div>
      ) : filteredMembers.length > 0 && (
        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{member.name}</h3>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(member.role)}
                          <span className="text-sm text-muted-foreground capitalize">
                            {member.role.toLowerCase()}
                          </span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(member.role)}`}></div>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>{member.role === 'ADMIN' ? 'Full Access' : 'Limited Access'}</span>
                        <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="px-2 py-1 text-sm border border-input rounded bg-background"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="MEMBER">Member</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
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
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              Team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMembers.filter(m => m.role === 'ADMIN').length}
            </div>
            <p className="text-xs text-muted-foreground">
              With full access
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMembers.filter(m => m.role === 'VIEWER').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMembers.filter(m => m.role === 'ADMIN').length}
            </div>
            <p className="text-xs text-muted-foreground">
              With full access
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
              <CardDescription>
                Send an invitation to join your workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input placeholder="colleague@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                  <option value="MEMBER">Member</option>
                  <option value="VIEWER">Viewer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message (Optional)</label>
                <Input placeholder="Hey! I'd like to invite you to collaborate on our AI prompts." />
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={() => setShowInviteModal(false)}>
                  Send Invitation
                </Button>
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 