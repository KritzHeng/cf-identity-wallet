import { IonButton, IonIcon, IonPage, IonToast } from "@ionic/react";
import { ellipsisVertical, trashOutline } from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { i18n } from "../../../i18n";
import { formatShortDate } from "../../../utils";
import "./ConnectionDetails.scss";
import { ConnectionsProps } from "../Connections/Connections.types";
import { PageLayout } from "../../components/layout/PageLayout";
import { RoutePath } from "../../../routes";
import { DataProps } from "../../../routes/nextRoute/nextRoute.types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getStateCache } from "../../../store/reducers/stateCache";
import { getNextRoute } from "../../../routes/nextRoute";
import { updateReduxState } from "../../../store/utils";
import { ConnectionOptions } from "../../components/ConnectionOptions";
import { VerifyPassword } from "../../components/VerifyPassword";
import { Alert } from "../../components/Alert";
import {
  getConnectionsCache,
  setConnectionsCache,
} from "../../../store/reducers/connectionsCache";

const ConnectionDetails = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const stateCache = useAppSelector(getStateCache);
  const connectionsData = useAppSelector(getConnectionsCache);
  const connectionDetails = history?.location?.state as ConnectionsProps;
  const [optionsIsOpen, setOptionsIsOpen] = useState(false);
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [verifyPasswordIsOpen, setVerifyPasswordIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDone = () => {
    const data: DataProps = {
      store: { stateCache },
    };
    const { nextPath, updateRedux } = getNextRoute(
      RoutePath.CONNECTION_DETAILS,
      data
    );
    updateReduxState(nextPath.pathname, data, dispatch, updateRedux);
    history.push(nextPath.pathname);
  };

  const handleDelete = () => {
    setOptionsIsOpen(false);
    setAlertIsOpen(true);
  };

  const verifyAction = () => {
    // @TODO - sdisalvo: Update core
    const updatedConnections = connectionsData.filter(
      (item) => item.id !== connectionDetails.id
    );
    dispatch(setConnectionsCache(updatedConnections));
    handleDone();
    setShowToast(true);
  };

  return (
    <IonPage
      className="page-layout connection-details"
      data-testid="connection-details-page"
    >
      <PageLayout
        header={true}
        title={""}
        closeButton={true}
        closeButtonAction={handleDone}
        closeButtonLabel={`${i18n.t("connections.details.done")}`}
        currentPath={RoutePath.CONNECTION_DETAILS}
        actionButton={true}
        actionButtonAction={() => {
          setOptionsIsOpen(true);
        }}
        actionButtonIcon={ellipsisVertical}
      >
        <div className="connection-details-content">
          <div className="connection-details-header">
            <div className="connection-details-logo">
              <img
                src={connectionDetails?.issuerLogo}
                alt="connection-logo"
              />
            </div>
            <span className="connection-details-issuer">
              {connectionDetails?.issuer}
            </span>
            <span className="connection-details-date">
              {formatShortDate(`${connectionDetails?.issuanceDate}`)}
            </span>
          </div>

          <div className="connection-details-info-block">
            <h3>{i18n.t("connections.details.label")}</h3>
            <div className="connection-details-info-block-inner">
              <span className="connection-details-info-block-line">
                <span className="connection-details-info-block-data">
                  {connectionDetails?.issuer}
                </span>
              </span>
            </div>
          </div>

          <div className="connection-details-info-block">
            <h3>{i18n.t("connections.details.date")}</h3>
            <div className="connection-details-info-block-inner">
              <span className="connection-details-info-block-line">
                <span className="connection-details-info-block-data">
                  {formatShortDate(`${connectionDetails?.issuanceDate}`)}
                </span>
              </span>
            </div>
          </div>

          <div className="connection-details-info-block">
            <h3>{i18n.t("connections.details.goalcodes")}</h3>
            <div className="connection-details-info-block-inner">
              <span className="connection-details-info-block-line">
                <span className="connection-details-info-block-data">
                  {connectionDetails?.goalCodes ||
                    i18n.t("connections.details.notavailable")}
                </span>
              </span>
            </div>
          </div>

          <div className="connection-details-info-block">
            <h3>{i18n.t("connections.details.handshake")}</h3>
            <div className="connection-details-info-block-inner">
              <span className="connection-details-info-block-line">
                <span className="connection-details-info-block-data">
                  {connectionDetails?.handshakeProtocol ||
                    i18n.t("connections.details.notavailable")}
                </span>
              </span>
            </div>
          </div>

          <div className="connection-details-info-block">
            <h3>{i18n.t("connections.details.attachments")}</h3>
            <div className="connection-details-info-block-inner">
              <span className="connection-details-info-block-line">
                <span className="connection-details-info-block-data">
                  {connectionDetails?.requestAttachments ||
                    i18n.t("connections.details.notavailable")}
                </span>
              </span>
            </div>
          </div>

          <div className="connection-details-info-block">
            <h3>{i18n.t("connections.details.endpoints")}</h3>
            <div className="connection-details-info-block-inner">
              <span className="connection-details-info-block-line">
                <span className="connection-details-info-block-data">
                  {connectionDetails?.serviceEndpoints ||
                    i18n.t("connections.details.notavailable")}
                </span>
              </span>
            </div>
          </div>

          <IonButton
            shape="round"
            expand="block"
            color="danger"
            data-testid="connection-details-delete-button"
            className="delete-button"
            onClick={() => setAlertIsOpen(true)}
          >
            <IonIcon
              slot="icon-only"
              size="small"
              icon={trashOutline}
              color="primary"
            />
            {i18n.t("connections.details.delete")}
          </IonButton>
        </div>
        <ConnectionOptions
          optionsIsOpen={optionsIsOpen}
          setOptionsIsOpen={setOptionsIsOpen}
          handleDelete={handleDelete}
        />
        <Alert
          isOpen={alertIsOpen}
          setIsOpen={setAlertIsOpen}
          dataTestId="alert-confirm"
          headerText={i18n.t("connections.details.options.alert.title")}
          confirmButtonText={`${i18n.t(
            "connections.details.options.alert.confirm"
          )}`}
          cancelButtonText={`${i18n.t(
            "connections.details.options.alert.cancel"
          )}`}
          actionConfirm={() => setVerifyPasswordIsOpen(true)}
        />
        <VerifyPassword
          isOpen={verifyPasswordIsOpen}
          setIsOpen={setVerifyPasswordIsOpen}
          onVerify={verifyAction}
        />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={`${i18n.t("connections.details.options.toast")}`}
          color="secondary"
          position="top"
          cssClass="confirmation-toast"
          duration={1500}
        />
      </PageLayout>
    </IonPage>
  );
};

export { ConnectionDetails };