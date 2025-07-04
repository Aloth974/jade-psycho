import './footer.scss';

export default function Footer() {
  const email: string = 'jade.techer.psycho@gmail.com';
  const number: string = '0759 60 30 77';

  return (
    <footer>
      <ul>
        <li className="footer-middle">
          <a href={`tel:${number}`}>
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
