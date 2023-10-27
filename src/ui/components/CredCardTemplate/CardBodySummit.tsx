import { QRCode } from "react-qrcode-logo";
import { CredentialDetails } from "../../../core/agent/agent.types";
import { i18n } from "../../../i18n";
import { formatShortDate } from "../../../utils";

// @TODO - sdisalvo: cardData should be of type CredentialDetails
const CardBodySummit = ({ cardData }: any) => {
  const credentialSubject = cardData.credentialSubject;
  return (
    <>
      <div className="card-body">
        <div className="left-column">
          <div className="card-body-info">
            <span className="card-body-info-label">
              {i18n.t("creds.card.layout.type")}
            </span>
            <span className="card-body-info-value">
              {credentialSubject.type
                ? `${credentialSubject.type}`.replace(
                  /([a-z])([A-Z])/g,
                  "$1 $2"
                )
                : ""}
            </span>
          </div>
          <div className="card-body-info">
            <span className="card-body-info-label">
              {i18n.t("creds.card.layout.validity")}
            </span>
            <span className="card-body-info-value">
              {formatShortDate(credentialSubject.startDate) +
                " - " +
                formatShortDate(credentialSubject.endDate)}
            </span>
          </div>
        </div>
        <div className="right-column">
          <QRCode
            value={credentialSubject.passId}
            size={100}
            fgColor={"black"}
            bgColor={"transparent"}
            qrStyle={"squares"}
            logoImage={""} // Optional
            logoWidth={100}
            logoHeight={100}
            logoOpacity={0}
            quietZone={0}
          />
        </div>
      </div>
    </>
  );
};

export default CardBodySummit;