import type { ComponentPropsWithoutRef } from 'react';
import { useState } from 'react';

import generateUID from '@proton/utils/generateUID';

import type { LogoProps } from './Logo';

type Props = ComponentPropsWithoutRef<'svg'> &
    Pick<LogoProps, 'variant' | 'size' | 'hasTitle'> & { withBackground?: boolean };

const ProtonForBusinessLogo = ({ withBackground = true, ...rest }: Props) => {
    // This logo can be several times in the view, ids has to be different each time
    const [uid] = useState(generateUID('logo'));

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="146"
            height="36"
            viewBox="0 0 146 36"
            fill="none"
            role="img"
            aria-labelledby={`${uid}-title`}
            {...rest}
        >
            {withBackground && <rect width="146" height="36" fill="white" />}
            <path
                d="M69.2681 24.7433V14.0742H75.3465V15.4235H70.6788V18.7812H75.1363V20.1305H70.6788V24.7433H69.2681Z"
                fill="currentColor"
            />
            <path
                d="M81.988 23.8025C81.297 24.5347 80.4367 24.9008 79.4061 24.9008C78.3756 24.9008 77.5102 24.5347 76.8098 23.8025C76.1196 23.0599 75.7742 22.1499 75.7742 21.0725C75.7742 19.9951 76.1196 19.0903 76.8098 18.3582C77.5102 17.6155 78.3756 17.2441 79.4061 17.2441C80.4367 17.2441 81.297 17.6155 81.988 18.3582C82.6883 19.0903 83.0381 19.9951 83.0381 21.0725C83.0381 22.1499 82.6883 23.0599 81.988 23.8025ZM77.7858 19.2681C77.3654 19.7388 77.1552 20.3403 77.1552 21.0725C77.1552 21.8047 77.3654 22.4061 77.7858 22.8768C78.2156 23.3475 78.756 23.5829 79.4061 23.5829C80.0563 23.5829 80.5916 23.3475 81.012 22.8768C81.4425 22.4061 81.6578 21.8047 81.6578 21.0725C81.6578 20.3403 81.4425 19.7388 81.012 19.2681C80.5916 18.7974 80.0563 18.5621 79.4061 18.5621C78.756 18.5621 78.2156 18.7974 77.7858 19.2681Z"
                fill="currentColor"
            />
            <path
                d="M84.3878 20.0997C84.3878 19.2106 84.6285 18.515 85.1085 18.0129C85.5885 17.5004 86.2191 17.2441 86.9994 17.2441C87.2496 17.2441 87.5049 17.2808 87.7645 17.354V18.6719C87.6751 18.6615 87.4947 18.6563 87.2249 18.6563C86.7544 18.6563 86.3944 18.7922 86.1442 19.0642C85.894 19.3361 85.7689 19.7963 85.7689 20.4449V24.7439H84.3878V20.0997Z"
                fill="currentColor"
            />
            <path
                d="M92.7327 24.7433V14.0742H95.9145C97.065 14.0742 97.9159 14.3357 98.4657 14.8587C99.0265 15.3817 99.3064 16.0982 99.3064 17.0082C99.3064 17.6044 99.1363 18.1013 98.7959 18.4987C98.4657 18.8963 98.0759 19.1368 97.6257 19.2205V19.2519C98.2563 19.3355 98.7763 19.5866 99.1865 20.005C99.6068 20.4234 99.817 20.9778 99.817 21.6681C99.817 22.6199 99.5115 23.373 98.9014 23.9274C98.2912 24.4714 97.4054 24.7433 96.2446 24.7433H92.7327ZM94.1436 23.394H96.1399C97.6308 23.394 98.3763 22.8187 98.3763 21.6681C98.3763 21.0824 98.1661 20.6482 97.7457 20.3659C97.3355 20.0835 96.6897 19.9422 95.8097 19.9422H94.1436V23.394ZM94.1436 18.5929H95.8097C96.5297 18.5929 97.0505 18.4674 97.3705 18.2163C97.7006 17.9653 97.8657 17.5626 97.8657 17.0082C97.8657 15.9518 97.1806 15.4235 95.8097 15.4235H94.1436V18.5929Z"
                fill="currentColor"
            />
            <path
                d="M106.362 24.0214C105.821 24.6073 105.096 24.9001 104.186 24.9001C103.275 24.9001 102.55 24.6073 102.01 24.0214C101.469 23.4357 101.199 22.6774 101.199 21.7465V17.4004H102.58V21.6367C102.58 22.2433 102.715 22.714 102.985 23.0487C103.255 23.3834 103.656 23.5508 104.186 23.5508C104.716 23.5508 105.116 23.3834 105.386 23.0487C105.656 22.714 105.792 22.2433 105.792 21.6367V17.4004H107.173V21.7465C107.173 22.6774 106.902 23.4357 106.362 24.0214Z"
                fill="currentColor"
            />
            <path
                d="M111.413 24.9008C110.633 24.9008 109.987 24.6811 109.477 24.2418C108.977 23.8025 108.706 23.2115 108.666 22.4689H110.047C110.087 22.8349 110.232 23.1279 110.482 23.3475C110.743 23.5672 111.053 23.677 111.413 23.677C111.783 23.677 112.069 23.5933 112.269 23.4259C112.469 23.2586 112.569 23.0547 112.569 22.8141C112.569 22.5316 112.439 22.3067 112.178 22.1394C111.919 21.9616 111.603 21.8203 111.233 21.7158C110.873 21.6112 110.508 21.4856 110.138 21.3392C109.778 21.1928 109.467 20.9574 109.207 20.6331C108.947 20.3089 108.817 19.8958 108.817 19.3937C108.817 18.8184 109.032 18.3163 109.462 17.8875C109.893 17.4586 110.487 17.2441 111.248 17.2441C111.968 17.2441 112.559 17.4481 113.019 17.8561C113.479 18.264 113.744 18.8341 113.815 19.5662H112.434C112.324 18.8341 111.928 18.468 111.248 18.468C110.948 18.468 110.698 18.5516 110.498 18.719C110.298 18.8864 110.197 19.1113 110.197 19.3937C110.197 19.6761 110.327 19.901 110.588 20.0683C110.848 20.2357 111.158 20.3717 111.518 20.4763C111.888 20.5808 112.253 20.7064 112.614 20.8528C112.984 20.9888 113.299 21.2241 113.559 21.5589C113.82 21.8831 113.949 22.3015 113.949 22.8141C113.949 23.4208 113.709 23.9228 113.229 24.3202C112.749 24.7073 112.143 24.9008 111.413 24.9008Z"
                fill="currentColor"
            />
            <path
                d="M115.284 24.7431V17.4003H116.665V24.7431H115.284ZM115.329 15.7215C115.159 15.5436 115.074 15.324 115.074 15.0625C115.074 14.801 115.159 14.5813 115.329 14.4035C115.509 14.2152 115.725 14.1211 115.975 14.1211C116.225 14.1211 116.435 14.2152 116.605 14.4035C116.785 14.5813 116.875 14.801 116.875 15.0625C116.875 15.324 116.785 15.5436 116.605 15.7215C116.435 15.8993 116.225 15.9882 115.975 15.9882C115.725 15.9882 115.509 15.8993 115.329 15.7215Z"
                fill="currentColor"
            />
            <path
                d="M118.479 20.3978C118.479 19.4669 118.754 18.7086 119.304 18.1228C119.855 17.537 120.595 17.2441 121.525 17.2441C122.456 17.2441 123.196 17.537 123.746 18.1228C124.297 18.7086 124.572 19.4669 124.572 20.3978V24.7439H123.191V20.5077C123.191 19.8905 123.051 19.4146 122.771 19.0798C122.491 18.7347 122.076 18.5621 121.525 18.5621C120.975 18.5621 120.56 18.7347 120.28 19.0798C119.999 19.4146 119.86 19.8905 119.86 20.5077V24.7439H118.479V20.3978Z"
                fill="currentColor"
            />
            <path
                d="M129.47 24.9008C128.439 24.9008 127.589 24.5452 126.919 23.8339C126.258 23.1227 125.928 22.2021 125.928 21.0725C125.928 19.9428 126.258 19.0223 126.919 18.311C127.579 17.5998 128.43 17.2441 129.47 17.2441C130.401 17.2441 131.191 17.6155 131.841 18.3582C132.502 19.0903 132.832 19.9951 132.832 21.0725C132.832 21.3026 132.822 21.4909 132.802 21.6374H127.354C127.454 22.2336 127.694 22.7095 128.074 23.0651C128.465 23.4103 128.93 23.5829 129.47 23.5829C130.34 23.5829 130.931 23.2377 131.241 22.5473H132.652C132.441 23.2586 132.046 23.8287 131.466 24.2576C130.896 24.6864 130.231 24.9008 129.47 24.9008ZM127.369 20.4449H131.406C131.356 19.9323 131.151 19.4931 130.791 19.127C130.431 18.7504 129.991 18.5621 129.47 18.5621C128.93 18.5621 128.47 18.7347 128.089 19.0798C127.719 19.4146 127.479 19.8696 127.369 20.4449Z"
                fill="currentColor"
            />
            <path
                d="M136.622 24.9008C135.842 24.9008 135.196 24.6811 134.686 24.2418C134.186 23.8025 133.916 23.2115 133.876 22.4689H135.256C135.296 22.8349 135.442 23.1279 135.692 23.3475C135.952 23.5672 136.262 23.677 136.622 23.677C136.992 23.677 137.277 23.5933 137.478 23.4259C137.678 23.2586 137.778 23.0547 137.778 22.8141C137.778 22.5316 137.647 22.3067 137.388 22.1394C137.127 21.9616 136.812 21.8203 136.442 21.7158C136.082 21.6112 135.716 21.4856 135.346 21.3392C134.986 21.1928 134.676 20.9574 134.416 20.6331C134.156 20.3089 134.026 19.8958 134.026 19.3937C134.026 18.8184 134.241 18.3163 134.671 17.8875C135.101 17.4586 135.697 17.2441 136.457 17.2441C137.178 17.2441 137.767 17.4481 138.228 17.8561C138.688 18.264 138.954 18.8341 139.023 19.5662H137.643C137.532 18.8341 137.138 18.468 136.457 18.468C136.157 18.468 135.907 18.5516 135.706 18.719C135.506 18.8864 135.407 19.1113 135.407 19.3937C135.407 19.6761 135.537 19.901 135.796 20.0683C136.057 20.2357 136.367 20.3717 136.727 20.4763C137.098 20.5808 137.463 20.7064 137.823 20.8528C138.193 20.9888 138.508 21.2241 138.768 21.5589C139.028 21.8831 139.159 22.3015 139.159 22.8141C139.159 23.4208 138.919 23.9228 138.438 24.3202C137.958 24.7073 137.353 24.9008 136.622 24.9008Z"
                fill="currentColor"
            />
            <path
                d="M142.924 24.9008C142.144 24.9008 141.498 24.6811 140.988 24.2418C140.488 23.8025 140.217 23.2115 140.177 22.4689H141.558C141.598 22.8349 141.743 23.1279 141.993 23.3475C142.254 23.5672 142.564 23.677 142.924 23.677C143.294 23.677 143.58 23.5933 143.78 23.4259C143.98 23.2586 144.08 23.0547 144.08 22.8141C144.08 22.5316 143.95 22.3067 143.689 22.1394C143.43 21.9616 143.114 21.8203 142.744 21.7158C142.384 21.6112 142.019 21.4856 141.649 21.3392C141.289 21.1928 140.978 20.9574 140.718 20.6331C140.458 20.3089 140.328 19.8958 140.328 19.3937C140.328 18.8184 140.543 18.3163 140.973 17.8875C141.404 17.4586 141.998 17.2441 142.759 17.2441C143.479 17.2441 144.07 17.4481 144.53 17.8561C144.99 18.264 145.255 18.8341 145.326 19.5662H143.945C143.835 18.8341 143.439 18.468 142.759 18.468C142.459 18.468 142.209 18.5516 142.009 18.719C141.809 18.8864 141.708 19.1113 141.708 19.3937C141.708 19.6761 141.838 19.901 142.099 20.0683C142.359 20.2357 142.669 20.3717 143.029 20.4763C143.399 20.5808 143.764 20.7064 144.125 20.8528C144.495 20.9888 144.81 21.2241 145.07 21.5589C145.331 21.8831 145.46 22.3015 145.46 22.8141C145.46 23.4208 145.22 23.9228 144.74 24.3202C144.26 24.7073 143.654 24.9008 142.924 24.9008Z"
                fill="currentColor"
            />
            <path
                d="M12.4133 24.6506V18.4023C12.4133 15.8531 13.842 13.8229 16.6998 13.8229C17.1585 13.8159 17.6162 13.8689 18.0622 13.9806V16.5511C17.7375 16.5286 17.4566 16.5286 17.3265 16.5286C15.8127 16.5286 15.1617 17.2503 15.1617 18.7166V24.6506H12.4133Z"
                fill="currentColor"
            />
            <path
                d="M18.8848 19.3509C18.8848 16.2153 21.1578 13.8242 24.3187 13.8242C27.4796 13.8242 29.7519 16.2137 29.7519 19.3509C29.7519 22.488 27.4789 24.8984 24.3183 24.8984C21.1578 24.8984 18.8848 22.4849 18.8848 19.3509ZM27.0463 19.3509C27.0463 17.5687 25.8988 16.3056 24.3187 16.3056C22.7386 16.3056 21.5908 17.5675 21.5908 19.3509C21.5908 21.1554 22.7383 22.3961 24.3187 22.3961C25.8992 22.3961 27.0463 21.1538 27.0463 19.3509Z"
                fill="currentColor"
            />
            <path
                d="M37.7184 16.3269H34.7529V20.2745C34.7529 21.6505 35.2289 22.2822 36.5929 22.2822C36.7227 22.2822 37.047 22.2822 37.4588 22.2598V24.5833C36.896 24.7411 36.3991 24.8314 35.8568 24.8314C33.5622 24.8314 32.0033 23.3876 32.0033 20.6582V16.3269H30.1632V14.0487H30.6219C30.8034 14.0487 30.9832 14.0114 31.1509 13.9389C31.3186 13.8665 31.4709 13.7603 31.5992 13.6265C31.7275 13.4927 31.8292 13.3338 31.8985 13.159C31.9679 12.9842 32.0035 12.7968 32.0033 12.6077V10.4619H34.7529V14.0487H37.7184V16.3269Z"
                fill="currentColor"
            />
            <path
                d="M38.5409 19.3509C38.5409 16.2153 40.814 13.8242 43.9749 13.8242C47.1358 13.8242 49.4085 16.2137 49.4085 19.3509C49.4085 22.488 47.1354 24.8999 43.9749 24.8999C40.8143 24.8999 38.5409 22.4849 38.5409 19.3509ZM46.7021 19.3509C46.7021 17.5687 45.5546 16.3056 43.9745 16.3056C42.3944 16.3056 41.2466 17.5675 41.2466 19.3509C41.2466 21.1554 42.394 22.3961 43.9745 22.3961C45.555 22.3961 46.7021 21.1538 46.7021 19.3509Z"
                fill="currentColor"
            />
            <path
                d="M50.8378 24.6509V18.6282C50.8378 15.831 52.5481 13.8232 55.6004 13.8232C58.6311 13.8232 60.3414 15.831 60.3414 18.6282V24.6509H57.6138V18.8538C57.6138 17.2976 56.9424 16.3275 55.6004 16.3275C54.2583 16.3275 53.5869 17.2976 53.5869 18.8538V24.6509H50.8378Z"
                fill="currentColor"
            />
            <path
                d="M6.68209e-07 20.5488V24.6501H2.76277V20.7262C2.76277 20.3445 2.90831 19.9783 3.16737 19.7084C3.42643 19.4384 3.77779 19.2868 4.14416 19.2868H6.97695C8.29843 19.2864 9.5657 18.7391 10.5 17.7652C11.4343 16.7914 11.9593 15.4708 11.9594 14.0938C11.9594 12.7165 11.4344 11.3957 10.4999 10.4218C9.5654 9.44785 8.29792 8.9006 6.97619 8.90039H6.68209e-07V14.0271H2.76277V11.6101H6.78999C7.41531 11.6101 8.01501 11.8689 8.45719 12.3295C8.89944 12.7902 9.14795 13.415 9.14817 14.0666C9.14817 14.7183 8.89974 15.3433 8.45748 15.8041C8.01523 16.2649 7.41545 16.5238 6.78999 16.5238H3.86221C3.35491 16.5236 2.85255 16.6276 2.38382 16.8297C1.9151 17.0319 1.48922 17.3283 1.13052 17.7022C0.771829 18.076 0.487362 18.5198 0.293378 19.0082C0.0993944 19.4966 -0.000297801 20.0201 6.68209e-07 20.5488Z"
                fill="currentColor"
            />
        </svg>
    );
};

export default ProtonForBusinessLogo;
