import React, { useState, useEffect } from 'react';
import FreelancerSidebar from '../Layout/FreelancerSidebar';
import api from '../../api/axiosConfig';
import FreelancerEditProfileModal from './FreelancerEditProfileModal';
import FreelancerSkillModal from './FreelancerSkillModal';
import FreelancerExperienceModal from './FreelancerExperienceModal';

function FreelancerProfile() {
  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false)

  useEffect(() => {
    // Fetch profile data
    api
      .get('/freelancers/freelancer-profile/')
      .then((response) => {
        setProfileData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
      });

    // Fetch skills
    api
      .get('/freelancers/freelancer-skills/')
      .then((response) => {
        setSkills(response.data);
      })
      .catch((error) => {
        console.error('Error fetching skills:', error);
      });

    // Fetch Experience
    api
      .get('/freelancers/freelancer-experience/')
      .then((response) => {
        setExperience(response.data); // Corrected variable name
      })
      .catch((error) => {
        console.error('Error fetching experience: ', error);
      })
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSkillModal = () => {
    setIsSkillModalOpen(true);
  };

  const closeSkillModal = () => {
    setIsSkillModalOpen(false);
  };

  const addSkillToSkillsList = (newSkill) => {
    setSkills([...skills, newSkill]);
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
  };

  const openExperienceModal = () => {
    setIsExperienceModalOpen(true);
  };

  const closeExperienceModal = () => {
    setIsExperienceModalOpen(false);
  };

  const addExperienceToExperienceList = (newExperience) => {
    setExperience([...experience, newExperience]);
  };

  const removeExperience = (experienceToRemove) => {
    const updatedExperiences = experience.filter((exp) => exp !== experienceToRemove);
    setExperience(updatedExperiences);
  };

  const updateProfileDataInParent = (newProfileData) => {
    setProfileData(newProfileData);
  };

  const handleSaveSkills = async () => {
    try {
      const currentSkills = await api.get('/freelancers/freelancer-skills/');
      const currentSkillIds = currentSkills.data.map(skill => skill.id);
  
      const skillsToDelete = currentSkillIds.filter(skillId => !skills.map(skill => skill.id).includes(skillId));
  
      for (const skillId of skillsToDelete) {
        const response = await api.delete(`/freelancers/freelancer-skills/update/${skillId}/`);
        if (response.status !== 200) {
          console.error(`Failed to update skill with ID ${skillId}`);
        }
      }
  
      setIsEditingSkills(false);
    } catch (error) {
      console.error('Error updating skills:', error);
    }
  };

  const handleSaveExperience = async () => {
    try {
      const currentExperience = await api.get('/freelancers/freelancer-experience/');
      const currentExperienceIds = currentExperience.data.map(experience => experience.id);
  
      const experienceToDelete = currentExperienceIds.filter(experienceId => !experience.map(experience => experience.id).includes(experienceId)); // Corrected variable name
  
      for (const experienceId of experienceToDelete) {
        const response = await api.delete(`/freelancers/freelancer-experience/update/${experienceId}/`);
        if (response.status !== 200) {
          console.error(`Failed to update experience with ID ${experienceId}`);
        }
      }
  
      setIsEditingExperience(false);
    } catch (error) {
      console.error('Error updating experience:', error);
    }
  };
    

  return (
    <div>
    <FreelancerSidebar />

    <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
        <div className="bg-white">
        {profileData && (
            <div className="container mx-auto py-8">
                <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                    <div className="col-span-4 sm:col-span-3">
                        <div className="bg-white shadow-xl rounded-lg p-6">
                            <div className="flex flex-col items-center">
                                <img
                                    src={process.env.REACT_APP_API_BASE_URL + profileData.profile_photo}
                                    className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                                    alt="Profile Photo"
                                />
                                <h1 className="text-xl font-bold">{profileData.freelancer.username}</h1>
                                <p className="text-gray-600">{profileData.title}</p>
                            </div>
                            <hr className="my-6 border-t border-gray-300" />
                            <div className="flex flex-col">
                                <span className="text-gray-800 uppercase font-bold tracking-wider mb-2">
                                    Personal Details
                                </span>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-gray-700">
                                        <p className="mb-2">Status:</p>
                                        <p className="mb-2">Year of Experience:</p>
                                        <p className="mb-2">Date of Birth:</p>
                                        <p className="mb-2">Age:</p>
                                        <p className="mb-2">City:</p>
                                        <p className="mb-2">State:</p>
                                        <p className="mb-2">Country:</p>
                                    </div>
                                    <div className=' font-semibold'>
                                        <p className="mb-2">{profileData.level}</p>
                                        <p className="mb-2">{profileData.year_of_experience}</p>
                                        <p className="mb-2">{profileData.date_of_birth}</p>
                                        <p className="mb-2">{profileData.age}</p>
                                        <p className="mb-2">{profileData.city}</p>
                                        <p className="mb-2">{profileData.state}</p>
                                        <p className="mb-2">{profileData.country}</p>
                                    </div>
                                </div>
                            <div className="col-span-4 sm:col-span-3 text-center">
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-3"
                                    onClick={openModal}
                                    >
                                    Edit Profile
                                </button>
                            </div>
                            </div>
                                <hr className="my-6 border-t border-gray-300" />
                                <div className="flex flex-col">
                                    <span className="text-gray-800 uppercase font-bold tracking-wider mb-2">
                                        Skills
                                    </span>
                                    <ul>
                                        {skills.map((skill) => (
                                            <li key={skill.id} className="mb-2">
                                            {isEditingSkills ? (
                                                <button
                                                className="text-white font-bold bg-blue-500 hover:bg-blue-700 rounded-full w-6 mx-2"
                                                onClick={() => removeSkill(skill)}
                                                >
                                                &#10005;
                                                </button>
                                            ) : null}
                                            {skill.skill}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                            onClick={openSkillModal}
                                        >
                                        Add Skills
                                        </button>
                                        {isEditingSkills ? (
                                            <button
                                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                                                onClick={handleSaveSkills}
                                            >
                                                Save Skills
                                            </button>
                                            ) : (
                                            <button
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
                                                onClick={() => setIsEditingSkills(true)}
                                            >
                                                Edit Skills
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <hr className="my-6 border-t border-gray-300" />
                                    <div className="flex flex-col">
    <span className="text-gray-800 uppercase font-bold tracking-wider mb-2">
      Experience
    </span>
    <ul>
      {experience.map((exp) => (
        <li key={exp.id} className="mb-2">
          {isEditingExperience ? (
            <button
              className="text-white font-bold bg-blue-500 hover:bg-blue-700 rounded-full w-6 mx-2"
              onClick={() => removeExperience(exp)}
            >
              &#10005;
            </button>
          ) : null}
          {exp.title}
        </li>
      ))}
    </ul>
    <div className="mt-6 flex flex-wrap gap-4 justify-center">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        onClick={openExperienceModal}
      >
        Add Experience
      </button>
      {isEditingExperience ? (
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          onClick={handleSaveExperience}
        >
          Save Experience
        </button>
      ) : (
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
          onClick={() => setIsEditingExperience(true)}
        >
          Edit Experience
        </button>
      )}
    </div>
  </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-4 sm:col-span-9">
                            <div className="bg-white shadow-xl rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-4">About Me</h2>
                                <p className="text-gray-700">
                                    {profileData.about}
                                </p>

                                <h2 className="text-xl font-bold mt-6 mb-4">Experience</h2>
                                <>
                                    {experience.map((experience) => (
                                    <div className="mb-6" key={experience.id}>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-bold">{experience.title}</span>
                                            <p>
                                                <span className="text-gray-600 mr-2">{experience.company}</span>
                                                <span className="text-gray-600">{experience.year}</span>
                                            </p>
                                        </div>
                                        <p className="mt-2">{experience.description}</p>
                                    </div>
                                    ))}
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    <FreelancerEditProfileModal isOpen={isModalOpen} closeModal={closeModal} updateProfileData={updateProfileDataInParent}/>
    <FreelancerSkillModal isOpen={isSkillModalOpen} closeModal={closeSkillModal} addSkillToParent={addSkillToSkillsList} />
    <FreelancerExperienceModal isOpen={isExperienceModalOpen} closeModal={closeExperienceModal} addExperienceToParent={addExperienceToExperienceList} />
    </div>
)
}

export default FreelancerProfile