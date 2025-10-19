// Supabase configuration and database operations
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2'

// Your Supabase configuration
// IMPORTANT: Replace these with your actual Supabase project credentials
const supabaseUrl = 'https://iaojznxxllkqeoiwnqfp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhb2p6bnh4bGxrcWVvaXducWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTIwMjMsImV4cCI6MjA3NjE4ODAyM30.2-QEGBBPKflPkqoEqxM3tL9dI-OzPwWUcVqMC6FGvtI'

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

// --- Resume Management ---
async function getResumeUrl() {
  try {
    // Get resume file from Supabase Storage
    const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUrl('Yogavinay_Kolluri_Resume.pdf', 3600) // 1 hour expiry
    
    if (error) {
      console.error('Error getting resume URL:', error)
      return null
    }
    
    return data.signedUrl
  } catch (error) {
    console.error('Error getting resume URL:', error)
    return null
  }
}

// --- Projects Management ---
async function getProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }
    
    return data
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

// --- Contact Form Submission ---
async function submitContactForm(formData) {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          created_at: new Date().toISOString()
        }
      ])
    
    if (error) {
      console.error('Error submitting contact form:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return { success: false, error: error.message }
  }
}

// --- Admin Functions (for uploading resume) ---
async function uploadResume(file) {
  try {
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload('Yogavinay_Kolluri_Resume.pdf', file, {
        cacheControl: '3600',
        upsert: true // This will overwrite the existing file
      })
    
    if (error) {
      console.error('Error uploading resume:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Error uploading resume:', error)
    return { success: false, error: error.message }
  }
}

// --- Admin Functions (for uploading project videos) ---
async function uploadProjectVideo(file, projectId) {
  try {
    const fileName = `project-${projectId}-video.mp4` // or .mov, .webm, etc.
    const { data, error } = await supabase.storage
      .from('project-videos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true // This will overwrite the existing file
      })
    
    if (error) {
      console.error('Error uploading project video:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Error uploading project video:', error)
    return { success: false, error: error.message }
  }
}

// Function to get project video URL
async function getProjectVideoUrl(projectId) {
  try {
    const fileName = `project-${projectId}-video.mp4`
    const { data, error } = await supabase.storage
      .from('project-videos')
      .createSignedUrl(fileName, 3600) // 1 hour expiry
    
    if (error) {
      console.error('Error getting project video URL:', error)
      return null
    }
    
    return data.signedUrl
  } catch (error) {
    console.error('Error getting project video URL:', error)
    return null
  }
}

// --- Admin Functions (for managing projects) ---
async function addProject(projectData) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          title: projectData.title,
          description: projectData.description,
          image_url: projectData.imageUrl,
          github_url: projectData.githubUrl,
          video_url: projectData.videoUrl,
          technologies: projectData.technologies || [],
          created_at: new Date().toISOString()
        }
      ])
    
    if (error) {
      console.error('Error adding project:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Error adding project:', error)
    return { success: false, error: error.message }
  }
}

async function updateProject(id, projectData) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        title: projectData.title,
        description: projectData.description,
        image_url: projectData.imageUrl,
        github_url: projectData.githubUrl,
        video_url: projectData.videoUrl,
        technologies: projectData.technologies || [],
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating project:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Error updating project:', error)
    return { success: false, error: error.message }
  }
}

async function deleteProject(id) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting project:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Error deleting project:', error)
    return { success: false, error: error.message }
  }
}

// Export functions
export { 
  getResumeUrl, 
  getProjects, 
  submitContactForm, 
  uploadResume, 
  uploadProjectVideo,
  getProjectVideoUrl,
  addProject, 
  updateProject, 
  deleteProject,
  supabase 
}
