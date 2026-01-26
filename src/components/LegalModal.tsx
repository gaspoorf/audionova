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
              The AudioNova website does not collect, process, or store any personal data from its visitors.
              No contact forms, user accounts, tracking cookies, or analytics tools that could identify users
              are used on this site. No personal data is shared with third parties or used for commercial purposes.
              Technical data strictly necessary for the operation and security of the website may be processed
              automatically by our hosting provider, without being accessed or used by AudioNova.
              For any questions regarding this Privacy Policy, you may contact us.
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
                [Local address]<br />
                [City, Postal Code, Country]
              </span>
            </div>
            <div className={styles.contactItem}>
              <Image src="/icons/call.svg" alt="Phone" width={20} height={20} />
              <span>[Local phone number]</span>
            </div>
            <div className={styles.contactItem}>
              <Image src="/icons/email.svg" alt="Email" width={20} height={20} />
              <span>[local-market@email.com]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}