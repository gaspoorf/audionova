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

        <h2 className={styles.title}>Privacy notice</h2>

        <div className={styles.section}>
          <div className={styles.scrollableContent}>
            <p className={styles.text}>
              The AudioNova website does not collect, process, or store any personal data from its visitors.
              No contact forms, user accounts, tracking cookies, or analytics tools that could identify users are used on this site. No personal data is shared with third parties or used for commercial purposes.
              Technical data strictly necessary for the operation and security of the website may be processed automatically by our hosting provider, without being accessed or used by AudioNova.
              For any questions regarding this Privacy Policy, you may contact us.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.scrollableContent}>
            <p className={styles.text}>
              <strong>Environment Disclaimer:</strong> "For accurate results, please take this test in a quiet environment using headphones. Background noise (street, public transport, etc.) may affect your results."
            </p>
            </div>
        </div>

        

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Contact</h3>
          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <Image src="/icons/location.svg" alt="Location" width={20} height={20} />
              <span>
                Boots Hearingcare Ltd<br />
                18 Trinity Square, Llandudno,<br />
                LL30 2RH.
              </span>
            </div>
            <div className={styles.contactItem}>
              <Image src="/icons/call.svg" alt="Phone" width={20} height={20} />
              <a href="tel:03452701600">0345 270 1600</a>
            </div>
            <div className={styles.contactItem}>
              <Image src="/icons/email.svg" alt="Email" width={20} height={20} />
              <a href="mailto:info@audionova.com">info@audionova.com</a>
            </div>
          </div>
        </div>

        {/* <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Cookie privacy notice</h3>
          <p className={styles.text}>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.
          </p>
        </div> */}
      </div>
    </div>
  );
}
