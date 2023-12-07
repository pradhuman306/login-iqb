import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEmailTemplate, getRegistrationEmailTemplate } from "../../actions/questioerAction";
import CustomLoader from "../Customloader";
import RegistrationEmail from "./RegistrationEmail";
import ResetEmail from "./ResetEmail";
const EmailTemplate = (props) => {
  const dispatch = useDispatch();
  const locale = props.locale;
  const pending = useSelector((state) => state.emailTemplateReducer).pending;
  useEffect(() => {
    dispatch(getRegistrationEmailTemplate());
    dispatch(getEmailTemplate());
  }, []);
  return (
    <>
    <div className="customer-main">
      <div className="body-content">
      {!pending ? <div className="custom-space-hor">
      <div className="row">
        <div className="col-md-6">
          <div className="">
            <ResetEmail {...props} />
          </div>
        </div>

        <div className="col-md-6">
          {/* <h2 className="mb-3">{locale.Registration_mail}</h2> */}
          <div className="">
            <RegistrationEmail {...props} />
          </div>
        </div>
      </div>
      </div> : <div className="loader-wrap"><CustomLoader/></div>}
      </div>
    </div>
    </>
  );
};

export default EmailTemplate;
