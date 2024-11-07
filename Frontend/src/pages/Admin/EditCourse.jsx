
import { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/card';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { Link } from 'react-router-dom';
import { Context } from '../../Context/Context';
import axios from 'axios';
import Loading from "../../components/Loading"

const EditCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { val } = location.state || {};
  const [title, setTitle] = useState(val?.title || '');
  const [description, setDescription] = useState(val?.description || '');
  const [imageLink, setImageLink] = useState(val?.imageLink || '');
  const [price, setPrice] = useState(val?.price || '');
  const [tags, setTags] = useState(val?.tags || []); // Initialize tags state
  const [newTag, setNewTag] = useState(''); // State for the new tag input
  const [message, setMessage] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const { dataFetcher, changeNotificationData } = useContext(Context);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessage('');
  }, [title, description, imageLink, price, tags]);

  const deleteCourse = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:3000/admin/deleteCourse/${val._id}`, {
        withCredentials: true
      });

      if (response.status === 200) {
        dataFetcher();
        changeNotificationData(`${title} Course Deleted Successfully!!!`);
        navigate("/adminName/Courses");
      } else {
        console.log("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    deleteCourse();
    setIsDeleteDialogOpen(false);
  };

  const handleEditChange = async () => {
    if (!title || !description || !imageLink || !price) {
      setMessage('All fields are required.');
      return;
    }
    setIsSaveDialogOpen(true);
  };

  const confirmSaveChanges = async () => {
    setLoading(true);
    const data = { title, description, imageLink, price, tags };
    try {
      const response = await axios.put(`http://localhost:3000/admin/editCourse/${val._id}`, data, {
        withCredentials: true
      });

      if (response.status === 200) {
        dataFetcher();
        changeNotificationData(`${title} Course Updated Successfully!!!`);
        navigate("/adminName/Courses");
      } else {
        console.log("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error updating course:", error);
    } finally {
      setIsSaveDialogOpen(false);
      setLoading(false);
    }
  };

  const revertChanges = () => {
    setTitle(val.title);
    setDescription(val.description);
    setPrice(val.price);
    setImageLink(val.imageLink);
    setTags(val.tags || []);
    navigate(`/adminName/${val._id}/add-video`);
  };

  // Handler to add a new tag
  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  // Handler to delete a tag
  const deleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex items-center justify-center space-x-6 p-6 gap-x-20">
          <div className="w-full max-w-md p-6 bg-green-50 rounded-lg shadow-md">
            <div className="mb-8 flex items-center gap-4">
              <Link to="/adminName/Courses" className="bg-gray-800 text-white py-2 px-4 text-xl rounded-md transition-transform transform hover:bg-gray-700 hover:scale-105">
                &larr; Back
              </Link>
              <h2 className="text-2xl font-bold text-center">Edit Course Details</h2>
            </div>
            
            <label className="block mb-1 font-semibold">Course Name</label>
            <input
              type="text"
              placeholder="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              placeholder="Enter course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="4"
            />

            <label className="block mb-1 font-semibold">Image Link</label>
            <input
              type="text"
              placeholder="Image Link"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
              className="w-full p-3 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block mb-1 font-semibold">Course Price</label>
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Tag Management */}
            <label className="block mb-1 font-semibold">Tags</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addTag}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div key={tag} className="bg-gray-200 rounded-full px-4 py-2 flex items-center gap-2">
                  <span>{tag}</span>
                  <button
                    onClick={() => deleteTag(tag)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {message && <div className="text-center text-blue-600">{message}</div>}
          </div>

          <div className="w-full max-w-md flex flex-col gap-y-4">
            <Card
              key={val._id}
              title={title}
              description={description}
              imageLink={imageLink}
              price={price}
            />
            <button className="w-full py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-200" onClick={revertChanges}>
              Add Videos
            </button>
            
            <button className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200" onClick={handleEditChange}>
              Save Changes
            </button>

            <ConfirmationDialog
              isOpen={isSaveDialogOpen}
              onClose={() => setIsSaveDialogOpen(false)}
              onConfirm={confirmSaveChanges}
              title="Confirm Save Changes"
              message="Are you sure you want to save the changes?"
            />

            <ConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => setIsDeleteDialogOpen(false)}
              onConfirm={confirmDelete}
              title="Confirm Delete Course"
              message="Are you sure you want to delete this course?"
            />

            <button className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200" onClick={() => setIsDeleteDialogOpen(true)}>
              Delete Course
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCourse;
