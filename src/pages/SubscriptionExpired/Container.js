import SubscriptionExpired from "../SubscriptionExpired/index";
import LayoutContainer from "../../Containers/LayoutContainer";

const Container = (props) => {
  console.log(props);
  return (
    <>
      <LayoutContainer
        auth={props.auth}
        children={<SubscriptionExpired auth={props.auth} />}
      />
    </>
  );
};
export default Container;
