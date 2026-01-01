import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamAPI } from "../../services/api";
import toast from "react-hot-toast";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { FaLinkedin, FaGithub, FaTwitter, FaDribbble } from "react-icons/fa";

import TeamModal from "../../components/admin/modals/TeamModal";

export default function AdminTeam() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["team", { search }],
    queryFn: () => teamAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => teamAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["team"]);
      toast.success("Team member deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || "Failed to delete team member"
      );
    },
  });

  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      deleteMutation.mutate(id);
    }
  };

  const members = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Team Members</h1>
          <p className="text-gray-600">
            Manage your team members and their profiles
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedMember(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm sm:mt-0 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Team Member
        </button>
      </div>

      {/* Search */}
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Team Grid */}
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-gray-400">
              <UserGroupIcon className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No team members found
            </h3>
            <p className="text-gray-500">
              Get started by adding your first team member.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
            {members
              .filter(
                (member) =>
                  member.name.toLowerCase().includes(search.toLowerCase()) ||
                  member.position.toLowerCase().includes(search.toLowerCase())
              )
              .map((member) => (
                <div
                  key={member.id}
                  className="transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="object-cover w-16 h-16 rounded-full"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-blue-600">
                              {member.name?.[0]}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 ml-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {member.name}
                            </h3>
                            <p className="font-medium text-blue-600">
                              {member.position}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(member)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Edit"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(member.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                              disabled={deleteMutation.isLoading}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <p className="mt-3 text-gray-600 line-clamp-2">
                          {member.bio}
                        </p>

                        <div className="mt-4 space-y-2">
                          {member.email && (
                            <div className="flex items-center text-sm text-gray-500">
                              <EnvelopeIcon className="w-4 h-4 mr-2" />
                              {member.email}
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <PhoneIcon className="w-4 h-4 mr-2" />
                              {member.phone}
                            </div>
                          )}
                        </div>

                        {member.social_links && (
                          <div className="flex mt-4 space-x-4">
                            {member.social_links.linkedin && (
                              <a
                                href={member.social_links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-600"
                                title="LinkedIn"
                              >
                                <FaLinkedin className="w-5 h-5" />
                              </a>
                            )}

                            {member.social_links.github && (
                              <a
                                href={member.social_links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-900"
                                title="GitHub"
                              >
                                <FaGithub className="w-5 h-5" />
                              </a>
                            )}

                            {member.social_links.twitter && (
                              <a
                                href={member.social_links.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-sky-500"
                                title="Twitter / X"
                              >
                                <FaTwitter className="w-5 h-5" />
                              </a>
                            )}

                            {member.social_links.dribbble && (
                              <a
                                href={member.social_links.dribbble}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-pink-500"
                                title="Dribbble"
                              >
                                <FaDribbble className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        )}

                        <div className="mt-4">
                          <div className="mb-2 text-sm font-medium text-gray-700">
                            Expertise:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {member.expertise?.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Team Modal */}
      <TeamModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSuccess={() => {
          queryClient.invalidateQueries(["team"]);
          setIsModalOpen(false);
          setSelectedMember(null);
        }}
      />
    </div>
  );
}
