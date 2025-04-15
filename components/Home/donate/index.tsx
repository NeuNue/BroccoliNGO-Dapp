import Image from "next/image";
import { FC, useState } from "react";
// import "./style.scss";
import { DONATE_BNB_TYPE, DONATE_TYPE } from "@/shared/constant";
import useDonate from "@/shared/hooks/useDonate";
import { useI18n } from "@/components/ui/I18nProvider";

interface Props {
  onClose: () => void;
}
const DonateDialog: FC<Props> = ({ onClose }) => {
  const { getString } = useI18n();
  const { donate } = useDonate();
  const [donateType, setDonateType] = useState<DONATE_TYPE | DONATE_BNB_TYPE>(
    DONATE_TYPE.BROCCOLI
  );
  const [donateAmount, setDonateAmount] = useState("");
  const options = [
    { value: DONATE_TYPE.BROCCOLI, label: "Broccoli" },
    { value: DONATE_BNB_TYPE.BNB, label: "BNB" },
    { value: DONATE_TYPE.USDT, label: "USDT" },
    { value: DONATE_TYPE.USDC, label: "USDC" },
  ];

  return (
    <div className="dialog" onClick={onClose}>
      <div
        className="panel-donate"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="panel-inner">
          <h2>Donate</h2>
          <Image
            className="foot-1"
            src="/foot-1.svg"
            width={85}
            height={85}
            alt="foot"
          ></Image>
          <Image
            className="foot-2"
            src="/foot-2.svg"
            width={85}
            height={85}
            alt="foot"
          ></Image>
          <Image
            className="foot-3"
            src="/foot-3.svg"
            width={85}
            height={85}
            alt="foot"
          ></Image>
          <Image
            className="foot-4"
            src="/foot-3.svg"
            width={85}
            height={85}
            alt="foot"
          ></Image>
          <div className="input-wrap">
            <div className="icon">
              <Image
                src={`/donate/${donateType}.png`}
                width={30}
                height={30}
                alt={donateType}
              ></Image>
            </div>
            <div className="opt">
              <select
                name=""
                id=""
                value={donateType}
                onChange={(e) => setDonateType(e.target.value as any)}
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="input">
              <input
                type="text"
                value={donateAmount}
                placeholder="0.00"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setDonateAmount("");
                    return;
                  }

                  // Price format regex: Allow numbers with up to 2 decimal places
                  const priceRegex = /^\d*\.?\d{0,6}$/;

                  // Remove any non-numeric characters except decimal
                  const sanitizedValue = value.replace(/[^\d.]/g, "");

                  // Check against regex and max value
                  if (!priceRegex.test(sanitizedValue)) {
                    return;
                  }
                  setDonateAmount(sanitizedValue);
                }}
              />
            </div>
          </div>
          <button
            type="button"
            className="confirm-btn confirm-donate"
            onClick={() => {
              donate(donateAmount, donateType);
            }}
          >
            <span>{getString(_TL_('Confirm Donation'))}</span>
          </button>
          <div className="text">
            <p>
              {getString(_TL_('You can follow us on {{link}} to see how we help stray animals.'), {
                link: <a
                  className="text-link"
                  href="https://x.com/Broccoli_NGO"
                  target="_blank"
                >
                  X
                </a>
              })}
            </p>
            <p>
              {getString(_TL_('You can also check our fund transfers on {{link}}. — everything is open and transparent.'), {
                link: <a
                  className="text-link"
                  href="https://bscscan.com/address/0x0022dc116bed13ddb7635298723b45a582d50c2e"
                  target="_blank"
                >
                  BscScan
                </a>
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateDialog;
