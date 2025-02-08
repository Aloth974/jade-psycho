import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

import './social-networks.scss';

export default function SocialNetworks() {
  const facebookUrl: string = `https://www.facebook.com/profile.php?id=61572511209865`;
  const instagramUrl: string = `https://www.facebook.com/profile.php?id=61572511209865`;

  return (
    <div className="social-networks">
      <ul>
        <li>
          <a href={facebookUrl} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
        </li>
        <li>
          <a href={instagramUrl} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </li>
      </ul>
    </div>
  );
}
