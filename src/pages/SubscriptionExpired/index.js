import { useDispatch, useSelector } from "react-redux";
import { signout, totalDayLeftSubscription } from "../../actions/auth";
import { langs } from "../../locale/localization";

const SubscriptionExpired = (props) => {
  const locale = langs(useSelector((state) => state.langReducer).locale);
  const dispatch = useDispatch();
  const UserData = useSelector((state) => state.authReducer).userdata;

  const disblock = {
    display: "block",
  };

  return (
    <>
      <div className="body-content">
        <div
          className="modal fade show"
          id={`subscription_expired`}
          tabIndex="-1"
          aria-labelledby="subscription_expired1"
          data-backdrop="static"
          aria-modal="true"
          style={disblock}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header justify-content-center">
                <h4>
                  {UserData.trial_period
                    ? locale.Trial_expired
                    : locale.Subs_expired}
                </h4>
              </div>

              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    dispatch(signout(locale));
                  }}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};
export default SubscriptionExpired;
