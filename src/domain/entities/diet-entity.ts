import { Entity } from '../../core/domain/Entity';

export type DietProps = {
  id: string;
  calories?: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Diet extends Entity<DietProps> {
  get id() {
    return this.props.id;
  }

  get calories() {
    return this.props.calories;
  }

  get description() {
    return this.props.description;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: DietProps) {
    const diet = new Diet({
      ...props,
    });

    return diet;
  }
}
