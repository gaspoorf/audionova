import Image from 'next/image';
import styles from './LegalModal.module.scss';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegalModal({ isOpen, onClose }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          Close ✕
        </button>

        <h2 className={styles.title}>LEGAL</h2>

        {/* #1 Test Results Disclaimer */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Results Disclaimer</h3>
          <div className={styles.scrollableContent}>
            <p className={styles.text}>
              The information provided gives indicative results only and is not a medical diagnosis.
              For a comprehensive hearing evaluation, please consult a hearing care professional
              at your nearest AudioNova center.
            </p>
          </div>
        </div>

        {/* #2 Environmental Disclaimer */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Environmental Disclaimer</h3>
          <div className={styles.scrollableContent}>
            <p className={styles.text}>
              For accurate results, please perform this in a quiet environment using headphones.
              Background noise (street, public transport, etc.) may affect your results.
            </p>
          </div>
        </div>

        {/* #3 Privacy Notice */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Privacy Notice</h3>
          <div className={styles.scrollableContent}>
            <p className={styles.text}>
              The AudioNova Hearing Check does not collect, process, or store any personally identifiable information from visitors. Tracking cookies and analytics tools used on the Hearing Check itself collect minimal information, and AudioNova does not sell or share this data for cross-context behavioral advertising. Personal information processed by the Hearing Check does not constitute Protected Health Information, as that term is defined under HIPAA. For more information about your rights and how AudioNova manages your personal information, please refer to our
              <a className={styles.legalLink} href="https://www.audionova.com/rights-and-policies/" target="_blank">Rights & Policies</a>
            </p>
          </div>
        </div>

        {/* Contact placeholders */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Contact</h3>
          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <Image src="/icons/location.svg" alt="Location" width={20} height={20} />
              <span>
                AudioNova<br />
                <a href="https://www.audionova.com/centers/search/" target="_blank">Find a center</a><br />
              </span>
            </div>
            <div className={styles.contactItem}>
              <Image src="/icons/call.svg" alt="Phone" width={20} height={20} />
              <span><a href="tel:888-845-7931" target="_blank">888-845-7931</a></span>
            </div>
            {/* <div className={styles.contactItem}>
              <Image src="/icons/email.svg" alt="Email" width={20} height={20} />
              <span>[local-market@email.com]</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}