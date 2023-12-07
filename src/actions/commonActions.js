export const checkEmptyObjectOrarray = (formdata) => {
  if (Array.isArray(formdata)) {
    if (formdata.length > 0) {
      return true;
    }
  } else if (formdata !== null) {
    {
      return true;
    }
  } else {
    return false;
  }
};
