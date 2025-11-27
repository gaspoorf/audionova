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

        <h2 className={styles.title}>Legal</h2>

        <div className={styles.section}>
          <h3 className={`${styles.sectionTitle} ${styles.highlight}`}>Privacy notice</h3>
          <div className={styles.scrollableContent}>
            <p className={styles.text}>
              To enable us to give you the best and most appropriate care and advice, we collect your personal data such as name, address and date of birth; we also collect your more sensitive personal data regarding your health such as your medical and family history for the purposes of ensuring the service we provide is appropriate for you. We also process your personal data for carefully considered and specific purposes which are in our interest and enable us to enhance the services we provide, but which we believe also benefit our customers. This may include creating profiles of our customers in order to promote relevant products and offers which we feel may be of interest to you based on your interactions with Boots. Your personal data will be stored for as long as necessary unless we are required to hold it for longer for legal reasons. We may share your personal information across Boots services (not any of your medical information) and with other companies that provide services on our behalf but we assure you that Boots will never sell your personal data. We are committed to safeguarding your privacy and keeping your personal data safe and secure is our top priority. For more information about who we may share your data with, how Boots process your data and how to amend or remove your data please see our privacy policy at www.boots.com/privacypolicy or find out how to contact us at www.boots.com/customer-services/contact-us
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Imprint</h3>
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
              <a href="mailto:info@bootshearingcare.com">info@bootshearingcare.com</a>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Cookie privacy notice</h3>
          <p className={styles.text}>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.
          </p>
        </div>
      </div>
    </div>
  );
}
