import {Container, Text} from "@react-three/uikit";
import {Button} from "../components/ui/button.tsx"


const UITest = () => {

    return (
        <Container height={64} alignItems="center" flexDirection="row" paddingX={16}>
          <Container marginLeft="auto" flexDirection="row" alignItems="center" gap={16}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open('https://github.com/pmndrs/uikit/tree/main/examples/dashboard', '_blank')}
            >
              <Text>Source Code</Text>
            </Button>
          </Container>
        </Container>
    )
}

export default UITest;
