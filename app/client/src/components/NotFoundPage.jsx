import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <>
            <Typography variant="h4"
                sx={{
                    marginTop: {
                        xs: "22%",
                        md: "17%",
                        ml: "10%",
                        lg: "8%",
                        xxl: "6%"
                    }
                }}
            >
                Page Not Found</Typography>
            <Link to="/sessions">Back to Sessions</Link>
        </>
    )
}

export default NotFoundPage;