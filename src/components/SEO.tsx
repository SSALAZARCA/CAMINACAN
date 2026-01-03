import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title} | CaminaCan</title>
            <meta name="description" content={description || "La mejor plataforma de paseadores de perros confiables en Colombia."} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta property="og:title" content={`${title} | CaminaCan`} />
            <meta property="og:description" content={description || "La mejor plataforma de paseadores de perros confiables en Colombia."} />
            <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
    );
};

export default SEO;
