import { categories } from "../data";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import "@styles/Form.scss";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const Form = ({ type, work, setWork, handleSubmit, submitLoading }) => {
  const handleUploadPhotos = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array
    const newPhotos = files.slice(0, 4 - work.photos.length); // Limit to 4 total photos
  
    if (newPhotos.length + work.photos.length > 4) {
      alert("You can only upload a maximum of 4 photos.");
      return;
    }
  
    setWork((prevWork) => ({
      ...prevWork,
      photos: [...prevWork.photos, ...newPhotos],
    }));
  };
  

  const handleRemovePhotos = (indexToRemove) => {
    const newPhotos = work.photos.filter(
      (_, i) => i !== parseInt(indexToRemove)
    );
    setWork({ ...work, photos: newPhotos });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "title" && value.length > 100) {
      // Limit title to 100 characters
      return toast.error("Title cannot exceed 100 characters.",{id:'toast-title-limit'});
    }
  
    if (name === "description" && value.length > 500) {
      // Limit description to 500 characters
      return toast.error("Description cannot exceed 500 characters.",{id:'toast-description-limit'});
    }
  
    if (name === "price") {
      const parsedValue = parseFloat(value);
      if (parsedValue < 3 || parsedValue > 10000) {
        // Limit price between 0 and 10,000
        return toast.error("Price must be between $3 and $10,000.",{id:'toast-price-limit'});
      }
    }
  
    // Update state if all validations pass
    setWork({ ...work, [name]: value });
  };
  

  return (
    <div className="form">
      <h1 className="text-slate-900 font-extrabold text-3xl">{type} Your Artwork</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-x-2">
        <div className="w-1/2">
          <div className="flex flex-col gap-y-2">
          <h3 className="font-semibold">Which of these categories best describes your work?</h3>
        <div className="category-list ">
          {categories?.map((item, index) => (
            <p
              key={index}
              className={`${work.category === item ? "selected" : ""}`}
              onClick={() => setWork({ ...work, category: item })}
            >
              {item}
            </p>
          ))}
        </div>
            <div className="flex flex-col my-4 gap-y-2">
              <h3>Add some photos of your work.</h3>
              <h3 className=" w-full lg:w-5/6"><span className="text-black">Please note that all the photos should be relavent to a single piece of artwork as it will be counted as one artwork.</span><span className="text-red-500">* </span></h3>
            </div>
          </div>

          {work.photos.length < 1 && (
            <div className="photos">
              <input
                id="image"
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleUploadPhotos}
                multiple
              />
              <label htmlFor="image" className="alone">
                <div className="icon">
                  <IoIosImages />
                </div>
                <p>Upload from your device</p>
              </label>
            </div>
          )}
          {(work.photos.length > 0) && (
            <div className="photos">
              {work?.photos?.map((photo, index) => (
                <div key={index} className="photo">
                  {photo instanceof Object ? (
                    <img src={URL.createObjectURL(photo)} alt="work" />
                  ) : (
                    <img src={photo} alt="work" />
                  )}
                  <button type="button" onClick={() => handleRemovePhotos(index)}>
                    <BiTrash />
                  </button>
                </div>
              ))}
            {(work.photos.length < 4)  &&
              <div>
                <input
                id="image"
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleUploadPhotos}
                multiple
              />
              <label htmlFor="image" className="together">
                <div className="icon">
                  <IoIosImages />
                </div>
                <p>Upload from your device</p>
              </label>
              </div>}
            </div>
          )}
        </div>
        <div className="description w-4/12 ">
        <h3>What makes your Work attractive?</h3>
          <p>Title</p>
          <input
            type="text"
            name="title"
            value={work.title}
            placeholder="Title"
            onChange={handleChange}
            required
          />
          <p>Description</p>
          <textarea
            name="description"
            value={work.description}
            placeholder="Description"
            onChange={handleChange}
            required
          />
            <p>Now, set your PRICE</p>
            <span>$</span>
            <input
              type="number"
              placeholder="Price"
              onChange={handleChange}
              name="price"
              value={work.price}
              required
              className="price"
            />
          <div className="w-full flex justify-center">
            <button className="px-4 submit_btn py-2 transition-colors rounded-lg bg-white outline-blue-900 text-blue-900 outline outline-1 hover:bg-blue-900 hover:text-white mt-8 " type="submit" disabled={submitLoading}>
              {submitLoading?<>
              Creating...
              </>:'Create Artwork'}
            </button>
          </div>
          </div>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default Form;
