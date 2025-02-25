export const removeImageFromArray = (indexToRemove, setImages) => {
  setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
};