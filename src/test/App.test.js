import React from 'react';
import { render, screen } from '@testing-library/react';
import Search from '../components/Search';

//Test thet the search page renders correctly
it('Renders Git Search', () => {
    render(<Search />);
    expect(screen.getByText('Git Search')).toBeInTheDocument();
})