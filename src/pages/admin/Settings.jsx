import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsAPI } from '../../services/api'
import toast from 'react-hot-toast'
import {
  Cog6ToothIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general')
  const [formData, setFormData] = useState({})
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.getAll(),
  })

  const updateMutation = useMutation({
    mutationFn: ({ key, value }) => settingsAPI.update(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings'])
      toast.success('Settings updated successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update settings')
    }
  })

  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = (key) => {
    if (formData[key] !== undefined) {
      updateMutation.mutate({ key, value: formData[key] })
    }
  }

  const settings = data?.data || {}

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'site', name: 'Site Info', icon: GlobeAltIcon },
    { id: 'contact', name: 'Contact', icon: EnvelopeIcon },
    { id: 'social', name: 'Social Media', icon: UserCircleIcon },
    { id: 'seo', name: 'SEO', icon: BuildingOfficeIcon },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Site Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Title
                  </label>
                  <input
                    type="text"
                    value={formData.site_title || settings.site_title || ''}
                    onChange={(e) => handleInputChange('site_title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleSave('site_title')}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={formData.site_description || settings.site_description || ''}
                    onChange={(e) => handleInputChange('site_description', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleSave('site_description')}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Logo & Favicon</h3>
              <div className="flex items-center space-x-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo
                  </label>
                  <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <PhotoIcon className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favicon
                  </label>
                  <div className="h-16 w-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <PhotoIcon className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'site':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company_name || settings.company_name || ''}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleSave('company_name')}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Company
                  </label>
                  <textarea
                    value={formData.company_about || settings.company_about || ''}
                    onChange={(e) => handleInputChange('company_about', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleSave('company_about')}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <div className="flex">
                    <input
                      type="email"
                      value={formData.contact_email || settings.contact_email || ''}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleSave('contact_email')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <div className="flex">
                    <input
                      type="tel"
                      value={formData.contact_phone || settings.contact_phone || ''}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleSave('contact_phone')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Address
                  </label>
                  <div className="flex">
                    <textarea
                      value={formData.contact_address || settings.contact_address || ''}
                      onChange={(e) => handleInputChange('contact_address', e.target.value)}
                      rows="2"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleSave('contact_address')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'social':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links</h3>
              <div className="space-y-4">
                {[
                  { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/yourpage' },
                  { key: 'twitter', label: 'Twitter URL', placeholder: 'https://twitter.com/yourprofile' },
                  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/yourcompany' },
                  { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/yourprofile' },
                  { key: 'youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/yourchannel' },
                  { key: 'github', label: 'GitHub URL', placeholder: 'https://github.com/yourprofile' },
                ].map((social) => (
                  <div key={social.key} className="flex items-center">
                    <label className="w-32 text-sm font-medium text-gray-700">
                      {social.label}
                    </label>
                    <div className="flex-1 flex">
                      <input
                        type="url"
                        value={formData[social.key] || (settings.social_links && JSON.parse(settings.social_links)[social.key]) || ''}
                        onChange={(e) => handleInputChange(social.key, e.target.value)}
                        placeholder={social.placeholder}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => handleSave(social.key)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'seo':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.site_keywords || settings.site_keywords || ''}
                    onChange={(e) => handleInputChange('site_keywords', e.target.value)}
                    placeholder="web development, software company, digital solutions"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleSave('site_keywords')}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={formData.google_analytics || settings.google_analytics || ''}
                    onChange={(e) => handleInputChange('google_analytics', e.target.value)}
                    placeholder="UA-XXXXXXXXX-X"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleSave('google_analytics')}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your website settings and configurations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {renderTabContent()}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-3">Danger Zone</h3>
        <p className="text-red-700 mb-4">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="space-y-4">
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Clear Cache
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ml-4">
            Reset All Settings
          </button>
        </div>
      </div>
    </div>
  )
}