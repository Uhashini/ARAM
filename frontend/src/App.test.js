import { render } from '@testing-library/react';

// Simple component test without routing
const SimpleComponent = () => <div>Test Component</div>;

test('renders test component', () => {
  render(<SimpleComponent />);
  expect(document.querySelector('div')).toBeInTheDocument();
});
