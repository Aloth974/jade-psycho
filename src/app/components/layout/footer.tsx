import './footer.scss';

export default function Footer() {
  const email: string = 'jade.techer.psycho@gmail.com';
  const number: string = '07 59 60 30 77';
  const numberE164: string = '+33759603077';

  return (
    <footer>
      <ul>
        <li>
          <a href={`tel:${numberE164}`}>
            {number}
          </a>
        </li>
        <li>
          <a href={`mailto:${email}`}>
            {email}
          </a>
        </li>
      </ul>
    </footer>
  );
}
