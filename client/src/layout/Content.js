import React from 'react';

const Content = ({children , className}) => {
    return (
        <section className={ `flex-1 ${className}` }>
            { children }
        </section>
    );
}

export default Content;
