import { Button } from './Button.tsx';
// import logoPath from '../assets/logo-green.svg';
import { Link } from 'react-router-dom';

export function NavBar() {
  return (
    <div className="w-full flex flex-row border">
      <div className="flex justify-start items-center w-[33.33%]">
        <img src={'uncommend logoPath'} className="h-12 w-auto m-2" />
      </div>
      <div className="flex justify-center w-[33.33%]"></div>
      <div className="flex justify-end w-[33.33%]">
        <div className="flex justify-center items-center pr-2">
          <Link to="/login">
            <Button stretchFull={true}>Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
