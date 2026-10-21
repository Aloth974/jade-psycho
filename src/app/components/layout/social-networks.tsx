import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

import { site } from '@/config/site';

import './social-networks.scss';

export default function SocialNetworks() {
  return (
    <div className="social-networks">
      <ul>
        <li>
          <a href={site.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
        </li>
        <li>
          <a href={site.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </li>
      </ul>
    </div>
  );
}
