import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function ProjectCard({project}) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>{project.title}</Card.Title>
        <Card.Text>
          {project.description}
        </Card.Text>
        <Button variant="primary"><a href={project.liveDemo} rel= "noreferrer" target="_blank">View Project</a></Button>
      </Card.Body>
    </Card>
  );
}

export default ProjectCard;