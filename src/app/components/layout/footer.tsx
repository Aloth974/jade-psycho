import { site } from '@/config/site';

import './footer.scss';

export default function Footer() {
  return (
    <footer>
      <ul>
        <li>
          <a href={`tel:${site.phone.e164}`}>
            {site.phone.display}
          </a>
        </li>
        <li>
          <a href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </li>
      </ul>
    </footer>
  );
}
