import type { ImgHTMLAttributes } from 'react';
import AppIcon from '../../imgs/icon.svg';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src={AppIcon} {...props} />
}
