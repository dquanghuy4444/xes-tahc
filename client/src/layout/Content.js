import React from 'react';

const Content = ({children}) => {
    return (
        <section className="flex-1">
            { children }
        </section>
    );
}

export default Content;
