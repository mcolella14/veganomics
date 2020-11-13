import React from 'react';
import ContentLoader from 'react-content-loader'
import { useTheme } from '@material-ui/core/styles';



function Loader (props)  {
    const theme = useTheme();
    console.log(theme.palette)
    console.log(theme.palette.secondary.main)
    return(
        <ContentLoader 
        speed={1}
        width={960}
        height={320}
        viewBox="0 0 1024 320"
        backgroundColor={theme.palette.primary.main}
        foregroundColor={theme.palette.secondary.main}
        {...props}
        >
        <rect x="0" y="0" rx="2" ry="2" width="300" height="150" />
        <rect x="330" y="0" rx="2" ry="2" width="300" height="150" />
        <rect x="660" y="0" rx="2" ry="2" width="300" height="150" />
        <rect x="0" y="170" rx="2" ry="2" width="300" height="150" />
        <rect x="330" y="170" rx="2" ry="2" width="300" height="150" />
        <rect x="660" y="170" rx="2" ry="2" width="300" height="150" />
        </ContentLoader>
    )   
}
export default Loader